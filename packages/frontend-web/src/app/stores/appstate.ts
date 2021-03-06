/*
Copyright 2019 Google Inc.

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

import { IArticlesState } from './articles';
import { ICategoriesState } from './categories';
import { ICommentsState } from './comments';
import { ICommentSummaryScoresState } from './commentSummaryScores';
import { ICountsState } from './counts';
import { IPreselectsState } from './preselects';
import { IRulesState } from './rules';
import { ITaggingSensitivitiesState } from './taggingSensitivities';
import { ITagsState } from './tags';
import { ITextSizesState } from './textSizes';
import { ITopScoresState, ITopScoresSummaryState } from './topScores';
import { IUsersState } from './users';

export type IGlobalState = Readonly<{
  categories: ICategoriesState;
  articles: IArticlesState;
  comments: ICommentsState;
  commentSummaryScores: ICommentSummaryScoresState;
  counts: ICountsState;
  users: IUsersState;
  tags: ITagsState;
  rules: IRulesState;
  preselects: IPreselectsState;
  taggingSensitivities: ITaggingSensitivitiesState;
  textSizes: ITextSizesState;
  topScores: ITopScoresState;
  topScoresSummary: ITopScoresSummaryState;
}>;
