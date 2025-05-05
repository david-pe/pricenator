# Pricenator

This Wix app automatically updates product prices based on customer orders.

## How it works

1. When a customer places an order, the app listens for the order event
2. For each product in the order, the app automatically increases its price by $1
3. If any user is currently viewing a product whose price has changed, they will receive a real-time notification about the price update

## Features

- **Automatic Price Updates**: Prices are automatically increased by $1 for each purchased product
- **Real-time Notifications**: Users viewing a product when its price changes will see a notification
- **Customizable Messages**: You can customize the notification message in the editor

## Installation

1. Install the app to your Wix site
2. Add the Price Updater component to your product pages
3. Customize the notification message in the editor

## Configuration Options

In the editor, you can configure:
- Whether to show a badge with the notification
- The message displayed when a price changes

## Setup 🔧

##### Install dependencies:

```console
npm install
```

## Available Scripts

In the project directory, you can run:

```console
npm run dev
```