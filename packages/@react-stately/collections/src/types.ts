/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {ItemProps, ItemRenderer} from '@react-types/shared';
import {Key, ReactElement, ReactNode} from 'react';
import {Rect} from './Rect';
import {ReusableView} from './ReusableView';
import {Size} from './Size';
import {Transaction} from './Transaction';

export interface ItemStates {
  isSelected?: boolean,
  isExpanded?: boolean,
  isDisabled?: boolean,
  isFocused?: boolean
}

export interface Node<T> extends ItemStates {
  type: 'section' | 'item' | 'column' | 'cell',
  key: Key,
  value: T,
  level: number,
  hasChildNodes: boolean,
  childNodes: Iterable<Node<T>>,
  rendered: ReactNode,
  textValue: string,
  'aria-label'?: string,
  index?: number,
  wrapper?: ((element: ReactElement) => ReactElement) | void,
  parentKey?: Key,
  prevKey?: Key,
  nextKey?: Key,
  props?: ItemProps<T>
}

export interface PartialNode<T> {
  type?: 'section' | 'item' | 'column' | 'cell',
  key?: Key,
  value?: T,
  element?: ReactElement,
  wrapper?: ((element: ReactElement) => ReactElement) | void,
  rendered?: ReactNode,
  textValue?: string,
  'aria-label'?: string,
  index?: number,
  renderer?: ItemRenderer<T>,
  childKey?: string,
  hasChildNodes?: boolean,
  childNodes?: () => IterableIterator<PartialNode<T>>,
  props?: ItemProps<T>
}

export interface Collection<T> extends Iterable<T> {
  readonly size: number;
  getKeys(): Iterable<Key>,
  getItem(key: Key): T,
  getKeyBefore(key: Key): Key | null,
  getKeyAfter(key: Key): Key | null,
  getFirstKey(): Key | null,
  getLastKey(): Key | null
}

export interface InvalidationContext<T extends object, V> {
  contentChanged?: boolean,
  offsetChanged?: boolean,
  sizeChanged?: boolean,
  animated?: boolean,
  beforeLayout?(): void,
  afterLayout?(): void,
  afterAnimation?(): void,
  transaction?: Transaction<T, V>
}

export interface CollectionManagerDelegate<T extends object, V, W> {
  setVisibleViews(views: W[]): void,
  setContentSize(size: Size): void,
  setVisibleRect(rect: Rect): void,
  getType?(content: T): string,
  renderView(type: string, content: T): V,
  renderWrapper(
    parent: ReusableView<T, V> | null,
    reusableView: ReusableView<T, V>,
    children: ReusableView<T, V>[],
    renderChildren: (views: ReusableView<T, V>[]) => W[]
  ): W,
  beginAnimations(): void,
  endAnimations(): void,
  getScrollAnchor?(rect: Rect): Key
}
