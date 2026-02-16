import { ShopSettings } from '../../models/shopSettings/shopSettings.model.js';
export const shopSettingsService = {
    getSettings: async () => {
        const settings = await ShopSettings.findOne();
        if (!settings) {
            // Return default or empty structure if not initialized,
            // or create a default one to ensure the app works.
            // Let's create a default one if it doesn't exist for simplicity.
            return await ShopSettings.create({
                shop_name: 'My Pharmacy',
                gst_number: '22AAAAA0000A1Z5', // Dummy default
                drug_license_no: 'DL-DEFAULT',
                address_line_1: 'To be configured',
                city: 'City',
                state: 'State',
                pincode: '000000',
                phone: '0000000000',
            });
        }
        return settings;
    },
    updateSettings: async (data) => {
        let settings = await ShopSettings.findOne();
        if (settings) {
            return await settings.update(data);
        }
        else {
            return await ShopSettings.create(data);
        }
    },
};
//# sourceMappingURL=shopSettings.service.js.map