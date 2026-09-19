import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { Vendor, Invoice } from '../src/models/index.js';

let mongo: MongoMemoryServer; const app = createApp();

describe('FinSight MVP end-to-end', () => {
  beforeAll(async () => { mongo = await MongoMemoryServer.create(); await mongoose.connect(mongo.getUri()); const vendor=await Vendor.create({business_id:'demo-business',name:'Acme Software Services',behavioral_profile:{typical_amount_min:200000,typical_amount_max:500000,currencies:['INR'],destination_accounts:['1234564821'],frequency_per_month:1,payment_count:8,preferred_day_of_month:25,preferred_hour:10}}); await Invoice.create({business_id:'demo-business',vendor_id:vendor._id,amount:1870000,currency:'INR',due_date:new Date(Date.now()+2*86400000),destination_account:'9876549137',status:'REVIEW',source:'seed'}); });
  afterAll(async()=>{await mongoose.disconnect(); await mongo.stop();});
  it('runs invoice -> risk -> route -> simulation -> retrieval', async()=>{
    const login=await request(app).post('/api/auth/demo-login').send({email:'e2e@finsight.local',business_id:'demo-business'}); const token=login.body.data.token; const auth={Authorization:`Bearer ${token}`};
    const inv=await Invoice.findOne({business_id:'demo-business'}).lean();
    const risk=await request(app).post('/api/risk/analyze').set(auth).send({invoice_id:String(inv!._id),amount:1870000,currency:'INR',destination_account:'9876549137',created_at:new Date()});
    expect(risk.status).toBe(200); expect(risk.body.data.risk_level).toBe('HIGH');
    const routes=await request(app).post('/api/routes/compare').set(auth).send({risk_score:risk.body.data.risk_score}); expect(routes.status).toBe(200); expect(routes.body.data.routes.length).toBeGreaterThanOrEqual(3);
    const rec=await request(app).post('/api/routes/recommend').set(auth).send({risk_score:risk.body.data.risk_score}); expect(rec.status).toBe(200);
    const sim=await request(app).post('/api/payments/simulate').set(auth).send({invoice_id:String(inv!._id),route_id:rec.body.data.recommendation.route_id}); expect(sim.status).toBe(201); expect(sim.body.data.transaction.status).toBe('COMPLETED');
    const tx=await request(app).get(`/api/payments/${sim.body.data.transaction._id}`).set(auth); expect(tx.status).toBe(200); expect(tx.body.data.payment.events.length).toBeGreaterThanOrEqual(6);
  });
});
