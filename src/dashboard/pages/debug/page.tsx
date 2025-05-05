import React from 'react';
import {
  Page,
  Card,
  Box,
  Text,
  Heading,
  WixDesignSystemProvider,
} from '@wix/design-system';

export default function Index() {
  return (
    <WixDesignSystemProvider>
      <Page>
        <Page.Header title="Pricenator Debug" />
        <Page.Content>
          <Card>
            <Card.Content>
              <Box direction="vertical" gap="24px">
                <Heading as="h3">Production Deployment Required</Heading>
                <Text>
                  This app's event handlers only work properly in a production environment.
                </Text>
                <Text>
                  To test the functionality, please:
                </Text>
                <ol style={{ marginLeft: '20px' }}>
                  <li>
                    <Text>Deploy the app using <code>wix app release</code></Text>
                  </li>
                  <li>
                    <Text>Install the app on your site</Text>
                  </li>
                  <li>
                    <Text>Create a real order using the Wix Store</Text>
                  </li>
                  <li>
                    <Text>Check that the product's price increases by $1</Text>
                  </li>
                </ol>
                <Text weight="bold">
                  Note: Local development cannot properly test the order events feature
                  due to limitations with event webhook forwarding.
                </Text>
              </Box>
            </Card.Content>
          </Card>
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
} 