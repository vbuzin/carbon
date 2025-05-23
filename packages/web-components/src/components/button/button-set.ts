/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { BUTTON_KIND } from './defs';
import styles from './button.scss?lit';
import { prefix } from '../../globals/settings';
import CDSButtonSetBase from './button-set-base';
import { carbonElement as customElement } from '../../globals/decorators/carbon-element';

/**
 * Button set.
 *
 * @element cds-button-set
 */
@customElement(`${prefix}-button-set`)
class CDSButtonSet extends CDSButtonSetBase {
  /**
   * `true` if the buttons should be stacked. Only applies to the button-set variant.
   */
  @property({ type: Boolean, reflect: true })
  stacked = false;

  /**
   * Handler for @slotchange, set the first cds-button to kind secondary and primary for the remaining ones
   *
   * @private
   */
  protected _handleSlotChange(event: Event) {
    const childItems = (event.target as HTMLSlotElement)
      .assignedNodes()
      .filter((elem) =>
        (elem as HTMLElement).matches !== undefined
          ? (elem as HTMLElement).matches(
              (this.constructor as typeof CDSButtonSet).selectorItem
            )
          : false
      );

    childItems.forEach((elem, index) => {
      (elem as HTMLElement).setAttribute(
        'kind',
        index === 0 ? BUTTON_KIND.SECONDARY : BUTTON_KIND.PRIMARY
      );
    });

    const update = new CustomEvent(`${prefix}-btn-set-update`, {
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    this.dispatchEvent(update);
  }

  render() {
    const { stacked } = this;
    const defaultClasses = {
      [`${prefix}--btn-set--stacked`]: stacked,
    };
    const classes = classMap(defaultClasses);

    return html`<slot class="${classes} @slotchange="${this._handleSlotChange}"></slot>`;
  }
  /**
   * A selector that will return the child items.
   */
  static get selectorItem() {
    return `${prefix}-button`;
  }

  static styles = styles;
}

export default CDSButtonSet;
