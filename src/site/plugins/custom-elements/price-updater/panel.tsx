import React, { type FC, useState, useEffect } from 'react';
import { widget } from '@wix/editor';
import {
  SidePanel,
  WixDesignSystemProvider,
  Input,
  FieldSet,
  FormField,
  ToggleSwitch,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { PRICE_CHANGED_MESSAGE } from './consts.js';

const Panel: FC = () => {
  const [message, setMessage] = useState<string>();
  const [showBadge, setShowBadge] = useState<string>();

  useEffect(() => {
    widget.getProp('message').then(setMessage);
    widget.getProp('show-badge').then(setShowBadge);
  }, []);

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <SidePanel.Field>
        <FormField label="Show Badge" labelPlacement="left" labelWidth="1fr">
          <ToggleSwitch
            size="small"
            checked={showBadge === 'true'}
            onChange={(event) => {
              setShowBadge(event.target.checked.toString());
              widget.setProp('show-badge', event.target.checked.toString());
            }}
          />
        </FormField>
      </SidePanel.Field>
      <SidePanel.Field>
        <FieldSet legend="Notification Message">
          <Input
            value={message}
            placeholder={PRICE_CHANGED_MESSAGE}
            size="small"
            onChange={(event) => {
              setMessage(event.target.value);
              widget.setProp('message', event.target.value || PRICE_CHANGED_MESSAGE);
            }}
          />
        </FieldSet>
      </SidePanel.Field>
    </WixDesignSystemProvider>
  );
};

export default Panel; 