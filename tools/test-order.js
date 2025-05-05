#!/usr/bin/env node

/**
 * Test Order Creation Script
 * 
 * This script creates a test order for the Pricenator app,
 * which triggers the price update functionality.
 * 
 * Usage:
 *   node tools/test-order.js <siteId> <productId>
 */

const https = require('https');
const readline = require('readline');

// Parse command line arguments
const siteId = process.argv[2];
const productId = process.argv[3];

// Validate arguments
if (!siteId || !productId) {
  console.error('Usage: node tools/test-order.js <siteId> <productId>');
  console.error('Example: node tools/test-order.js 12345678-1234-1234-1234-123456789012 abcdef12-3456-7890-abcd-ef1234567890');
  process.exit(1);
}

// Configuration
const options = {
  hostname: 'www.wixapis.com',
  path: '/ecom/v1/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': '' // Will be filled by the user
  }
};

// Create test order payload
const orderData = {
  order: {
    billingInfo: {
      contactDetails: {
        firstName: 'Test User',
        lastName: 'Pricenator'
      }
    },
    lineItems: [{
      quantity: 1,
      productName: {
        original: 'Test Order Item'
      },
      catalogReference: {
        catalogItemId: productId,
        appId: '215238eb-22a5-4c36-9e7b-e7c08025e04e'
      },
      itemType: {
        preset: 'PHYSICAL'
      },
      price: {
        amount: '12'
      },
      taxInfo: {
        taxRate: '0'
      }
    }],
    channelInfo: {
      type: 'WEB'
    },
    priceSummary: {},
    currencyConversionDetails: {
      originalCurrency: 'ILS',
      conversionRate: '1'
    },
    status: 'APPROVED'
  }
};

// Create readline interface to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask for Wix API token
console.log('\n=== Pricenator Test Order Tool ===\n');
console.log('This tool will create a test order that triggers the price update functionality.');
console.log(`Site ID: ${siteId}`);
console.log(`Product ID: ${productId}`);

rl.question('\nEnter your Wix API token (leave empty to use wix app dev token): ', (token) => {
  if (token) {
    options.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    console.log('\nUsing provided API token');
  } else {
    console.log('\nNo token provided. Will use Wix dev environment token.');
    console.log('Make sure you have run "wix app dev" and your app is properly configured.');
  }
  
  console.log('\nCreating test order...');
  
  // Make the API request
  const req = https.request(options, (res) => {
    console.log(`\nResponse Status: ${res.statusCode} ${res.statusMessage}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        console.log('\nResponse Data:');
        console.log(JSON.stringify(parsedData, null, 2));
        
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('\n✅ Test order created successfully!');
          console.log('\n🔍 Next steps:');
          console.log(`1. Check if product ${productId} price has been updated`);
          console.log('2. Look for logs in the console where "wix app dev" is running');
          console.log('3. Verify that users viewing the product see a notification');
        } else {
          console.error('\n❌ Failed to create test order.');
        }
      } catch (e) {
        console.error('\nError parsing response:', e);
        console.error('Raw response:', data);
      }
      rl.close();
    });
  });
  
  req.on('error', (error) => {
    console.error('\nError making request:', error);
    rl.close();
  });
  
  // Write order data to request body
  req.write(JSON.stringify(orderData));
  req.end();
});

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\nOperation cancelled by user');
  rl.close();
  process.exit(0);
}); 