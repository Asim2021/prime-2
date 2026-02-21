import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    // 1. Sales Returns
    await queryInterface.createTable(
      'sales_returns',
      {
        id: { type: DataTypes.CHAR(36), primaryKey: true },
        sale_id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: { model: 'sales', key: 'id' },
        },
        bill_no: { type: DataTypes.STRING, allowNull: false },
        return_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        reason: { type: DataTypes.STRING, allowNull: true },
        total_refund: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
        created_by: {
          type: DataTypes.CHAR(36),
          allowNull: true,
          references: { model: 'users', key: 'id' },
        },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
      },
      { transaction },
    );

    await queryInterface.addIndex('sales_returns', [ 'sale_id' ], { transaction });
    await queryInterface.addIndex('sales_returns', [ 'bill_no' ], { transaction });

    // 2. Sales Return Items
    await queryInterface.createTable(
      'sales_return_items',
      {
        id: { type: DataTypes.CHAR(36), primaryKey: true },
        sales_return_id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: { model: 'sales_returns', key: 'id' },
          onDelete: 'CASCADE',
        },
        sale_item_id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: { model: 'sale_items', key: 'id' },
        },
        batch_id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: { model: 'batches', key: 'id' },
        },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        refund_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      },
      { transaction },
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const down = async (queryInterface) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.dropTable('sales_return_items', { transaction });
    await queryInterface.dropTable('sales_returns', { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
