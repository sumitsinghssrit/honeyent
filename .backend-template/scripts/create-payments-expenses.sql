-- Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_no VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    party_name VARCHAR(255) NOT NULL,
    party_type VARCHAR(50) NOT NULL, -- 'Customer' or 'Supplier'
    amount DECIMAL(15,2) NOT NULL,
    payment_mode VARCHAR(20) NOT NULL, -- 'Cash', 'Bank', 'UPI', 'Cheque'
    reference VARCHAR(100),
    notes TEXT,
    payment_direction VARCHAR(10) NOT NULL, -- 'In' (receipt) or 'Out' (payment)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_no ON payments(payment_no);
CREATE INDEX IF NOT EXISTS idx_payment_party ON payments(party_name, party_type);
CREATE INDEX IF NOT EXISTS idx_payment_date ON payments(payment_date);

-- Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_no VARCHAR(50) UNIQUE NOT NULL,
    expense_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Driver Salary', 'Truck Repair', etc.
    vehicle_id UUID REFERENCES vehicles(id),
    driver_id UUID REFERENCES drivers(id),
    paid_to VARCHAR(255) NOT NULL,
    payment_mode VARCHAR(20) NOT NULL, -- 'Cash', 'Bank', 'UPI', 'Cheque'
    amount DECIMAL(15,2) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expense_no ON expenses(expense_no);
CREATE INDEX IF NOT EXISTS idx_expense_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expense_vehicle ON expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_expense_driver ON expenses(driver_id);
CREATE INDEX IF NOT EXISTS idx_expense_date ON expenses(expense_date);
