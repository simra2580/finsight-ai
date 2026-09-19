import { describe, expect, it } from 'vitest';
import { DEMO_ROUTES } from '../src/services/route/route.service.js';
describe('Route engine demo data',()=>it('has at least three simulated routes',()=>expect(DEMO_ROUTES.length).toBeGreaterThanOrEqual(3)));
