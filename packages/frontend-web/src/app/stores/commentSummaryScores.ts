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
import { Action, createAction, handleActions } from 'redux-actions';
import { makeTypedFactory, TypedRecord} from 'typed-immutable-record';

import { IAppDispatch, IAppState } from '../appstate';
import { listCommentSummaryScoresById } from '../platform/dataService';

export interface ICommentSummaryScore {
  tagId: string;
  score: number;
}

export interface ICommentSummaryScoreStateRecord extends TypedRecord<ICommentSummaryScoreStateRecord>, ICommentSummaryScore {}

const CommentSummaryScore = makeTypedFactory<ICommentSummaryScore, ICommentSummaryScoreStateRecord>({
  tagId: null,
  score: null,
});

export type ICommentSummaryScoresState = Readonly<{
  isReady: boolean;
  items: Map<string, List<ICommentSummaryScore>>;
}>;

const initialState: ICommentSummaryScoresState = {
  isReady: false,
  items: null,
};

export const loadCommentSummaryScoresStart: () => Action<void> = createAction(
    'comment-summary-scores/LOAD_COMMENT_SUMMARY_SCORES_START',
  );

export type ILoadCommentSummaryScoresCompletePayload = Map<string, List<ICommentSummaryScoreStateRecord>>;
export const loadCommentSummaryScoresComplete: (payload: ILoadCommentSummaryScoresCompletePayload) => Action<ILoadCommentSummaryScoresCompletePayload> =
  createAction<ILoadCommentSummaryScoresCompletePayload>(
    'comment-summary-scores/LOAD_COMMENT_SUMMARY_SCORES_COMPLETE',
  );

export const reducer = handleActions<
  ICommentSummaryScoresState,
  ILoadCommentSummaryScoresCompletePayload
>({
  [loadCommentSummaryScoresStart.toString()]: (state) => ({...state, isReady: false}),
  [loadCommentSummaryScoresComplete.toString()]: (state, { payload }: Action<ILoadCommentSummaryScoresCompletePayload>) => ({
    isReady: true,
    items: state.items ? state.items.merge(payload) : payload,
  }),
}, initialState);

export async function loadCommentSummaryScores(dispatch: IAppDispatch, commentId: string) {
  await dispatch(loadCommentSummaryScoresStart());
  const scores = await listCommentSummaryScoresById(commentId);
  const mappedScores = scores.reduce((sum, score) => {
    const existingList = sum.get(commentId) ? sum.get(commentId) : List<ICommentSummaryScoreStateRecord>();

    return sum.set(score.commentId, existingList.push(CommentSummaryScore(score)));
  }, Map<string, List<ICommentSummaryScoreStateRecord>>());

  await dispatch(loadCommentSummaryScoresComplete(mappedScores));
}

export function getSummaryScoresById(state: IAppState, commentId: string) {
  const stateRecord = state.global.commentSummaryScores;
  return stateRecord && stateRecord.items && stateRecord.items.get(commentId);
}
