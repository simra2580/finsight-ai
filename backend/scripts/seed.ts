import mongoose from 'mongoose';
import { connectDb, disconnectDb } from '../src/config/db.js';
import { User, Vendor, Invoice, Transaction, RiskEvent, Route, Settlement } from '../src/models/index.js';
import { DEMO_ROUTES } from '../src/services/route/route.service.js';

async function seed() {
  await connectDb();
  const business_id = 'demo-business';
  await Promise.all([User.deleteMany({ business_id }), Vendor.deleteMany({ business_id }), Invoice.deleteMany({ business_id }), Transaction.deleteMany({ business_id }), RiskEvent.deleteMany({ business_id }), Route.deleteMany({ business_id }), Settlement.deleteMany({ business_id })]);
  await User.create({ business_id, role:'finance_manager', authentication_metadata:{ email:'demo@finsight.local' } });
  const vendor = await Vendor.create({ business_id, name:'Acme Software Services', behavioral_profile:{ typical_amount_min:200000, typical_amount_max:500000, currencies:['INR'], destination_accounts:['1234564821'], frequency_per_month:1, preferred_day_of_month:25, preferred_hour:10, payment_count:8, last_payment_at:new Date(Date.now()-30*86400000), historical_behavior:[{amount:320000,currency:'INR',destination:'1234564821'}] } });
  const invoice = await Invoice.create({ business_id, vendor_id:vendor._id, amount:1870000, currency:'INR', due_date:new Date(Date.now()+2*86400000), extracted_data:{vendor:vendor.name,amount:1870000,currency:'INR',destination_account:'9876549137',invoice_number:'FS-DEMO-001',payment_details:{urgent:true}}, status:'REVIEW', invoice_number:'FS-DEMO-001', destination_account:'9876549137', payment_details:{urgent:true}, source:'seed' });
  await Route.insertMany(DEMO_ROUTES.map(r=>({...r,business_id,simulated:true})));
  console.log(JSON.stringify({ businessId:business_id, vendorId:String(vendor._id), invoiceId:String(invoice._id), email:'demo@finsight.local' },null,2));
  await disconnectDb();
}
seed().catch(async e=>{ console.error(e); await disconnectDb(); process.exit(1); });
