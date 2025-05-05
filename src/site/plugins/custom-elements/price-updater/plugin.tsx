import React, { useEffect, useState, type FC } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import { Badge, Box, Text, WixDesignSystemProvider } from '@wix/design-system';
import { InfoCircle } from '@wix/wix-ui-icons-common';
import { window as siteWindow } from '@wix/site-window';
import styles from './plugin.module.css';
import '@wix/design-system/styles.global.css';
import { PRICE_CHANGED_MESSAGE, CHANNEL_PREFIX } from './consts';

type Props = {
  productId: string;
  showBadge: boolean;
  message: string;
};

// Define type for the event data
interface PriceChangeEvent {
  type: string;
  productId: string;
  timestamp: string;
}

// This component will show a notification when the price changes
const CustomElement: FC<Props> = ({ productId, showBadge, message }) => {
  const [priceChanged, setPriceChanged] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only subscribe to price updates when in the actual site (not editor)
    siteWindow.viewMode().then((mode) => {
      if (mode === 'Site' && productId) {
        try {
          // Subscribe to price update events for this product
          // Note: This implementation may need to be adjusted based on the actual
          // available APIs in the Wix environment
          const messageHandler = (event: MessageEvent) => {
            if (event.data?.channel === `${CHANNEL_PREFIX}${productId}` && 
                event.data?.data?.type === 'PRICE_CHANGE') {
              // Show notification when price changes
              setPriceChanged(true);
              setIsVisible(true);
              
              // Hide notification after 5 seconds
              setTimeout(() => {
                setIsVisible(false);
              }, 5000);
            }
          };
          
          window.addEventListener('message', messageHandler);
          
          // Return cleanup function
          return () => {
            window.removeEventListener('message', messageHandler);
          };
        } catch (error) {
          console.error('Error setting up price change listener:', error);
        }
      }
    });
  }, [productId]);

  if (!priceChanged || !isVisible) {
    return null;
  }

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Box
        align="left"
        direction="vertical"
        gap="1"
        paddingTop={2}
        className={`${styles.root} ${styles.notification}`}
      >
        {showBadge && (
          <Box>
            <Badge prefixIcon={<InfoCircle />} skin="warningLight">
              Price Updated
            </Badge>
          </Box>
        )}
        <Box direction="vertical">
          <Text weight="bold">{message || PRICE_CHANGED_MESSAGE}</Text>
          <Text size="tiny" light secondary>
            The price of this product has just increased. Refresh to see the new price.
          </Text>
        </Box>
      </Box>
    </WixDesignSystemProvider>
  );
};

const customElement = reactToWebComponent(
  CustomElement,
  React,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ReactDOM as any,
  {
    props: {
      productId: 'string',
      showBadge: 'boolean',
      message: 'string',
    },
  }
);

export default customElement; 