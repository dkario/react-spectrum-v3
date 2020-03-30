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

import {ActionButton} from '@react-spectrum/button';
import {classNames, filterDOMProps, useHasChild, useSlotProps, useStyleProps} from '@react-spectrum/utils';
import CrossLarge from '@spectrum-icons/ui/CrossLarge';
import {DialogContext, DialogContextValue} from './context';
import {FocusScope} from '@react-aria/focus';
import {Grid} from '@react-spectrum/layout';
import {mergeProps} from '@react-aria/utils';
import React, {useContext, useRef} from 'react';
import {SpectrumBaseDialogProps, SpectrumDialogProps} from '@react-types/dialog';
import styles from '@adobe/spectrum-css-temp/components/dialog/vars.css';
import {useDialog, useModalDialog} from '@react-aria/dialog';

type DialogType = 'modal' | 'popover' | 'tray' | 'fullscreen' | 'fullscreenTakeover';

/**
 * Dialogs are windows that appear over the interface and block further interactions.
 * Contextual information, tasks, or workflows are typically contained within.
 */
export function Dialog(props: SpectrumDialogProps) {
  props = useSlotProps(props);
  let {
    type = 'popover' as DialogType,
    ...contextProps
  } = useContext(DialogContext) || {} as DialogContextValue;
  let {
    children,
    isDismissable = contextProps.isDismissable,
    onDismiss = contextProps.onClose,
    ...otherProps
  } = props;
  let {styleProps} = useStyleProps(otherProps);
  let allProps: SpectrumBaseDialogProps = mergeProps(
    mergeProps(
      mergeProps(
        filterDOMProps(otherProps),
        filterDOMProps(contextProps)
      ),
      styleProps
    ),
    {className: classNames(styles, {'spectrum-Dialog--dismissable': isDismissable})}
  );
  let size = type === 'popover' ? undefined : (otherProps.size || 'L');

  if (type === 'popover') {
    return <BaseDialog {...allProps} size={size}>{children}</BaseDialog>;
  } else {

    return (
      <ModalDialog {...allProps} size={size} type={type}>
        {children}
        {isDismissable &&
          <ActionButton
            slot="closeButton"
            isQuiet
            aria-label="dismiss"
            onPress={onDismiss}>
            <CrossLarge size="L" />
          </ActionButton>
        }
      </ModalDialog>
    );
  }
}

function ModalDialog(props: SpectrumBaseDialogProps) {
  let {modalProps} = useModalDialog();
  return <BaseDialog {...mergeProps(props, modalProps)} />;
}

let sizeMap = {
  S: 'small',
  M: 'medium',
  L: 'large',
  fullscreen: 'fullscreen',
  fullscreenTakeover: 'fullscreenTakeover'
};

function BaseDialog({children, slots, size, role, type, ...otherProps}: SpectrumBaseDialogProps) {
  let ref = useRef();
  let gridRef = useRef();
  let sizeVariant = sizeMap[type] || sizeMap[size];
  let {dialogProps, titleProps} = useDialog({ref, role, ...otherProps});

  let hasHeader = useHasChild(`:scope > .${styles['spectrum-Dialog-header']}`, gridRef);
  let hasFooter = useHasChild(`:scope > .${styles['spectrum-Dialog-footer']}`, gridRef);

  if (!slots) {
    slots = {
      container: {UNSAFE_className: styles['spectrum-Dialog-grid']},
      hero: {UNSAFE_className: styles['spectrum-Dialog-hero']},
      header: {UNSAFE_className: styles['spectrum-Dialog-header']},
      heading: {UNSAFE_className: classNames(styles, 'spectrum-Dialog-heading', {'spectrum-Dialog-heading--noHeader': !hasHeader}), ...titleProps},
      typeIcon: {UNSAFE_className: styles['spectrum-Dialog-typeIcon']},
      divider: {UNSAFE_className: styles['spectrum-Dialog-divider'], size: 'M'},
      content: {UNSAFE_className: styles['spectrum-Dialog-content']},
      footer: {UNSAFE_className: styles['spectrum-Dialog-footer']},
      closeButton: {UNSAFE_className: styles['spectrum-Dialog-closeButton']},
      buttonGroup: {UNSAFE_className: classNames(styles, 'spectrum-Dialog-buttonGroup', {'spectrum-Dialog-buttonGroup--noFooter': !hasFooter})}
    };
  }

  return (
    <FocusScope contain restoreFocus>
      <section
        {...mergeProps(otherProps, dialogProps)}
        className={classNames(
          styles,
          'spectrum-Dialog',
          {[`spectrum-Dialog--${sizeVariant}`]: sizeVariant},
          otherProps.className
        )}
        ref={ref}>
        <Grid slots={slots} ref={gridRef}>
          {children}
        </Grid>
      </section>
    </FocusScope>
  );
}
