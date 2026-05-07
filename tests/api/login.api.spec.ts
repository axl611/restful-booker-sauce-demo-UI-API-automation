import { test, expect } from '@playwright/test';

test.describe('Restful Booker API - Booking Lifecycle', () => {

    test('should complete full booking lifecycle: auth → create → read → update → delete', async ({ request }) => {

        // 1. Authentication - Generate auth token
        const authRes = await request.post('/auth', {
            data: { username: 'admin', password: 'password123' },
        });
        expect(authRes.status()).toBe(200);
        const { token } = await authRes.json();
        expect(token).toBeTruthy();

        // 2. Create Booking
        const payload = {
            firstname: 'Axel',
            lastname: 'Smith',
            totalprice: 150,
            depositpaid: true,
            bookingdates: { checkin: '2026-01-01', checkout: '2026-01-07' },
            additionalneeds: 'Breakfast',
        };
        const createRes = await request.post('/booking', {
            data: payload,
            headers: { 'Content-Type': 'application/json' },
        });
        expect(createRes.status()).toBe(200);
        const { bookingid, booking } = await createRes.json();
        expect(bookingid).toBeTruthy();
        expect(booking.firstname).toBe(payload.firstname);

        // 3. Read Booking
        const readRes = await request.get(`/booking/${bookingid}`);
        expect(readRes.status()).toBe(200);
        const readBody = await readRes.json();
        expect(readBody.firstname).toBe(payload.firstname);
        expect(readBody.bookingdates.checkout).toBe(payload.bookingdates.checkout);

        // 4. Update Booking
        const updatePayload = {
            ...payload,
            bookingdates: { ...payload.bookingdates, checkout: '2026-01-10' },
        };
        const updateRes = await request.put(`/booking/${bookingid}`, {
            data: updatePayload,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`,
            },
        });
        expect(updateRes.status()).toBe(200);
        const updateBody = await updateRes.json();
        expect(updateBody.bookingdates.checkout).toBe('2026-01-10');

        // 5. Delete Booking
        const deleteRes = await request.delete(`/booking/${bookingid}`, {
            headers: { 'Cookie': `token=${token}` },
        });
        expect(deleteRes.status()).toBe(201);

        // Confirm deletion
        const confirmRes = await request.get(`/booking/${bookingid}`);
        expect(confirmRes.status()).toBe(404);
    });
});
