import React, { useEffect, useState } from 'react';
import {
  Page,
  Card,
  Box,
  Text,
  Button,
  Loader,
  StatusIndicator,
  WixDesignSystemProvider,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

export default function Index() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [status, setStatus] = useState<'initializing' | 'success' | 'error'>('initializing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Initialize app on first load
    const initializeApp = async () => {
      try {
        setIsInitializing(true);
        
        // For demo purposes, simulate success without actual API call
        // In a real app, you would make the API call to initialize
        setTimeout(() => {
          setStatus('success');
          setIsInitializing(false);
        }, 1500);
        
        // The actual API call would look like this:
        // const response = await fetch('/api/initialize', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' }
        // });
        // 
        // if (!response.ok) {
        //   const error = await response.json();
        //   throw new Error(error.message || 'Failed to initialize app');
        // }
        // 
        // setStatus('success');
      } catch (error) {
        console.error('Initialization error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : String(error));
        setIsInitializing(false);
      }
    };
    
    initializeApp();
  }, []);

  const renderStatus = () => {
    switch (status) {
      case 'initializing':
        return (
          <Box align="center" verticalAlign="middle" gap={2}>
            <Loader size="small" />
            <Text>Initializing Pricenator...</Text>
          </Box>
        );
      case 'success':
        return (
          <Box align="center" verticalAlign="middle" gap={2}>
            <StatusIndicator status="success" />
            <Text>Pricenator is successfully installed and running!</Text>
          </Box>
        );
      case 'error':
        return (
          <Box direction="vertical" gap={2}>
            <Box align="center" verticalAlign="middle" gap={2}>
              <StatusIndicator status="error" />
              <Text>Error initializing Pricenator</Text>
            </Box>
            {errorMessage && (
              <Text skin="error">{errorMessage}</Text>
            )}
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Page>
        <Page.Header title="Pricenator" subtitle="Automatic price updates based on orders" />
        <Page.Content>
          <Card>
            <Card.Header title="Setup Status" />
            <Card.Content>
              <Box direction="vertical" gap={4}>
                {renderStatus()}
                
                {status === 'success' && (
                  <>
                    <Text>
                      Your Pricenator app is ready to use. When customers place orders, the prices of purchased products 
                      will automatically increase by $1.
                    </Text>
                    
                    <Box gap={2}>
                      <Button priority="secondary" as="a" href="/dashboard/debug">
                        Debug Tools
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </Card.Content>
          </Card>
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
} 