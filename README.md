# Home Stock

A React Native home inventory tracker built with Expo. It tracks pantry goods, toiletries, cleaning supplies, household supplies, quantities, package sizes, storage locations, opened status, notes, and expiry dates.

## Features

- Add and edit home inventory items
- Search by name, category, location, or notes
- Filter by expiring soon, low stock, and opened items
- Increment and decrement quantities from the inventory list
- Track common package types and package sizes
- Local device persistence with AsyncStorage
- Starter inventory so the first launch is not empty

## Run It

Install dependencies, then start Expo:

```bash
npm install
npm start
```

From the Expo screen, open the app in Expo Go on your phone, an Android emulator, an iOS simulator, or the web preview.

## Notes

Expiry dates use `YYYY-MM-DD` for now. The next useful upgrades would be barcode scanning, item photos, shopping-list generation, and notifications before food expires.
