import { orders } from '@wix/ecom';
import { products } from '@wix/stores';
import { PRICE_UPDATE_AMOUNT, CHANNEL_PREFIX } from '../../../site/plugins/custom-elements/price-updater/consts';

// Define the LineItem type that matches the Wix structure
interface LineItem {
  catalogReference?: {
    catalogItemId?: string;
  };
}

orders.onOrderCreated(event => {
  const eventTimestamp = new Date().toISOString();
  console.log(`[${eventTimestamp}] 📥 Order created event received`);
  
  // Log basic event info
  if (event) {
    console.log(`[${eventTimestamp}] Order ID: ${event.metadata?._id || 'unknown'}`);
    console.log(`[${eventTimestamp}] Line items: ${event.entity?.lineItems?.length || 0}`);
  } else {
    console.log(`[${eventTimestamp}] Event object is null or undefined`);
  }
  
  // Process the event asynchronously
  processOrderEvent(event)
    .then(() => console.log(`[${eventTimestamp}] ✅ Order event processing completed`))
    .catch(error => console.error(`[${eventTimestamp}] ❌ Order event processing failed:`, error));
});

/**
 * Process an order event by updating product prices
 */
async function processOrderEvent(event: any): Promise<void> {
  const timestamp = new Date().toISOString();
  
  try {
    // Validate event
    if (!event || !event.entity) {
      console.log(`[${timestamp}] ⚠️ Invalid event object received`);
      return;
    }
    
    const order = event.entity;
    
    // Check for line items
    if (!order.lineItems || order.lineItems.length === 0) {
      console.log(`[${timestamp}] ℹ️ No line items found in order`);
      return;
    }
    
    console.log(`[${timestamp}] 📦 Processing ${order.lineItems.length} line items`);
    
    // Process each product in the order
    const updatePromises = order.lineItems
      .filter((lineItem: LineItem) => lineItem.catalogReference?.catalogItemId)
      .map(async (lineItem: LineItem) => {
        const productId = lineItem.catalogReference!.catalogItemId!;
        console.log(`[${timestamp}] 🔍 Processing product: ${productId}`);
        
        try {
          // Update the product price
          return await updateProductPrice(productId);
        } catch (itemError) {
          console.error(`[${timestamp}] ❌ Error processing product ${productId}:`, itemError);
          return { productId, success: false, error: itemError };
        }
      });
    
    // Wait for all updates to complete
    const results = await Promise.allSettled(updatePromises);
    
    // Log results
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    console.log(`[${timestamp}] ✅ Order processing completed - Updated ${successful} products, Failed: ${failed}`);
  } catch (error) {
    console.error(`[${timestamp}] ❌ Error processing order:`, error);
    throw error;
  }
}

/**
 * Update a product's price by adding $1
 */
async function updateProductPrice(productId: string): Promise<any> {
  const timestamp = new Date().toISOString();
  try {
    console.log(`[${timestamp}] 💰 Updating price for product: ${productId}`);
    
    // Get the current product
    const response = await products.getProduct(productId);
    
    if (!response || !response.product) {
      console.error(`[${timestamp}] ❌ Product not found: ${productId}`);
      throw new Error(`Product not found: ${productId}`);
    }
    
    // Get the current price
    const currentPrice = Number(response.product.price?.price || 0);
    const newPrice = currentPrice + PRICE_UPDATE_AMOUNT;
    
    console.log(`[${timestamp}] 💲 Current price: ${currentPrice.toFixed(2)}, New price: ${newPrice.toFixed(2)}`);
    
    // Update the product with the new price
    const updateResult = await products.updateProduct(productId, {
      priceData: {
        price: newPrice
      }
    });
    
    console.log(`[${timestamp}] ✅ Price updated for product ${productId}`);
    
    // Return success result
    return {
      productId,
      success: true,
      previousPrice: currentPrice,
      newPrice
    };
  } catch (error) {
    console.error(`[${timestamp}] ❌ Error updating price for product ${productId}:`, error);
    throw error;
  }
} 