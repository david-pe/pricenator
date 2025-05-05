import React, { useState } from 'react';
import {
  Page,
  Card,
  Box,
  Input,
  Button,
  Text,
  Heading,
  FormField,
  Loader,
  Divider,
  WixDesignSystemProvider,
} from '@wix/design-system';

export default function Index() {
  const [productId, setProductId] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTestPriceUpdate = async () => {
    if (!productId) {
      setError('Please enter a product ID');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      // Make a real API call to update the price
      const response = await fetch(`/api/test-price?productId=${encodeURIComponent(productId)}`);
      const data = await response.json();
      
      if (response.ok) {
        setResult(JSON.stringify(data, null, 2));
      } else {
        setError(`Error: ${data.error || response.statusText}`);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WixDesignSystemProvider>
      <Page>
        <Page.Header title="Pricenator Debug" />
        <Page.Content>
          <Card>
            <Card.Header title="Test Price Update" />
            <Card.Content>
              <Box direction="vertical" gap={3}>
                <Text>
                  Use this page to manually test the price update functionality. Enter a product ID and click "Update Price" to increase the price by $1.
                </Text>
                
                <FormField label="Product ID">
                  <Input
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter product ID"
                  />
                </FormField>
                
                <Button onClick={handleTestPriceUpdate} disabled={isLoading}>
                  {isLoading ? <Loader size="tiny" /> : 'Update Price'}
                </Button>
                
                {error && (
                  <Box marginTop={2}>
                    <Text skin="error">{error}</Text>
                  </Box>
                )}
                
                {result && (
                  <Box marginTop={2} direction="vertical" gap={2}>
                    <Divider />
                    <Heading appearance="H4">Result:</Heading>
                    <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
                      {result}
                    </pre>
                  </Box>
                )}
              </Box>
            </Card.Content>
          </Card>
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
} 