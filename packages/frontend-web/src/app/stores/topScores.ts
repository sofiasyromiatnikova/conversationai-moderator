/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { List, Map } from 'immutable';
import { Action } from 'redux-actions';
import { makeTypedFactory, TypedRecord } from 'typed-immutable-record';

import { IAppDispatch, IAppState } from '../appstate';
import { loadTopScoresForSummaryScores, loadTopScoresForTag } from '../platform/dataService';
import { IQueuedModelState, makeQueuedModelStore } from '../util';

export interface ITopScoreState {
  commentId: string;
  start: number;
  end: number;
  score: number;
}

export interface ITopScoreStateRecord extends TypedRecord<ITopScoreStateRecord>, ITopScoreState {}

const TopScore = makeTypedFactory<ITopScoreState, ITopScoreStateRecord>({
  commentId: null,
  start: null,
  end: null,
  score: null,
});

export interface ITopScoresKeyState {
  commentId: string;
  tagId: string;
}

export interface ITopScoresKeyStateRecord extends TypedRecord<ITopScoresKeyStateRecord>, ITopScoresKeyState {}

const TopScoresKey = makeTypedFactory<ITopScoresKeyState, ITopScoresKeyStateRecord>({
  commentId: null,
  tagId: null,
});

export interface ITopSummaryScoresKeyState {
  commentId: string;
}

export interface ITopSummaryScoresKeyStateRecord extends TypedRecord<ITopSummaryScoresKeyStateRecord>, ITopSummaryScoresKeyState {}

const TopSummaryScoresKey = makeTypedFactory<ITopSummaryScoresKeyState, ITopSummaryScoresKeyStateRecord>({
  commentId: null,
});

const queuedModelStore = makeQueuedModelStore<ITopScoresKeyState, ITopScoreStateRecord>(
  async (keys: List<ITopScoresKeyState>) => {
    const commentIds = keys.map((k) => k.commentId) as List<string>;
    const tagId = keys.first().tagId;

    const scores = await loadTopScoresForTag(commentIds, tagId);

    return scores.reduce((sum: any, score: any) => {
      const key = TopScoresKey({ commentId: score.commentId, tagId });

      return sum.set(key, TopScore(score));
    }, Map<ITopScoresKeyState, ITopScoreStateRecord>());
  },
  300,
  12,
  (state: IAppState) => state.global.topScores,
);

const {
  reducer: topScoresReducer,
  loadModel: loadTopScoreByKey,
  getModels: getTopScores,
  getModel: getTopScore,
} = queuedModelStore;

const setTopScore: (payload: any) => Action<any> = queuedModelStore.setModel;

export type ITopScoresState = IQueuedModelState<ITopScoresKeyState, ITopScoreStateRecord>;

export function getTopScoreForComment(state: IAppState, commentId: string, tagId: string): ITopScoreState {
  const topScores = getTopScores(state);

  return topScores.get(TopScoresKey({ commentId, tagId }));
}

export async function loadTopScore(dispatch: IAppDispatch, commentId: string, tagId: string) {
  await dispatch(loadTopScoreByKey(TopScoresKey({ commentId, tagId })));
}

// Separate out Summary Scores because they need to be accessed differently

const {
  reducer: topScoresSummaryReducer,
  loadModel: loadTopSummaryScoreByKey,
  getModels: getTopSummaryScores,
  getModel: getTopSummaryScore,
  setModel: setTopSummaryScore,
} = makeQueuedModelStore<ITopSummaryScoresKeyState, ITopScoreStateRecord>(
  async (keys: List<ITopSummaryScoresKeyState>) => {
    const scores = await loadTopScoresForSummaryScores(keys.toArray());

    return scores.reduce((sum: any, score: any) => {
      const key = TopSummaryScoresKey({ commentId: score.commentId});

      return sum.set(key, TopScore(score));
    }, Map<ITopSummaryScoresKeyState, ITopScoreStateRecord>());
  },
  300,
  12,
  (state: IAppState) => state.global.topScoresSummary,
);

export type ITopScoresSummaryState = IQueuedModelState<ITopSummaryScoresKeyState, ITopScoreStateRecord>;

export function getTopSummaryScoreForComment(state: IAppState, commentId: string): ITopScoreState {
  const topScores = getTopSummaryScores(state);

  return topScores.get(TopSummaryScoresKey({ commentId }));
}

export async function loadTopSummaryScore(dispatch: IAppDispatch, commentId: string) {
  await dispatch(loadTopSummaryScoreByKey(TopSummaryScoresKey({ commentId })));
}

export {
  topScoresReducer,
  topScoresSummaryReducer,
  getTopScore,
  setTopScore,
  setTopSummaryScore,
  getTopSummaryScore,
};
