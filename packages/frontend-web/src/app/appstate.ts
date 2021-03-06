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
import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { IScenesState } from './scenes/appstate';
import { IGlobalState } from './stores/appstate';

export type IAppState = Readonly<{
  global: IGlobalState;
  scenes: IScenesState;
}>;

export type IThunkAction<R> = ThunkAction<R, IAppState, undefined, Action>;
export type IAppDispatch = ThunkDispatch<IAppState, undefined, Action>;
