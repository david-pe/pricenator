# Pricenator

A Wix app that automatically increases product prices by $1 whenever an order is placed and notifies users viewing those products about the price change.

## Features

- 🛒 Listens to order placed events
- 💰 Automatically updates product prices when orders are placed
- 🔔 Notifies users viewing products about price changes

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the app:
   ```
   npm run build
   ```
4. Deploy to Wix:
   ```
   wix app release
   ```

## Testing

### Production Testing

The event handlers for this app are designed to work in a production environment. Follow these steps to test the app:

1. Deploy the app using `wix app release`
2. Install the app on your Wix site
3. Create a real order using your Wix Store
4. Verify that the product price increases by $1 after the order is placed

## Production Monitoring

To monitor the app in production:

1. Check the Wix Developer Console for logs
2. Look for log messages with the prefix `🔄` and `✅` to confirm successful price updates
3. Monitor your product prices to ensure they're increasing correctly

## Implementation Details

### Backend

- The app listens for order created events via Wix's ecom module
- When an order is placed, it extracts the product IDs from the order
- For each product, it increases the price by $1
- After updating the price, it notifies the frontend

### Frontend

- A custom element that displays price change notifications
- Configuration options for customizing the notification message
- Event listening for price change notifications

## License

MIT