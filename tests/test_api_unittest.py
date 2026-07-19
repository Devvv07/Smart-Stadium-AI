import unittest
import json
from app import app

class TestSmartStadiumAPI(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_health_endpoint(self):
        rv = self.client.get('/api/health')
        self.assertEqual(rv.status_code, 200)
        data = json.loads(rv.data)
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['app'], 'Smart Stadium AI')

    def test_chat_endpoint_valid(self):
        rv = self.client.post('/api/chat', json={
            'prompt': 'Where is Gate A?',
            'language': 'English',
            'module': 'general'
        })
        self.assertEqual(rv.status_code, 200)
        data = json.loads(rv.data)
        self.assertEqual(data['status'], 'success')
        self.assertTrue('response' in data)

    def test_chat_endpoint_empty(self):
        rv = self.client.post('/api/chat', json={'prompt': ''})
        self.assertEqual(rv.status_code, 400)
        data = json.loads(rv.data)
        self.assertTrue('error' in data)

    def test_navigate_endpoint(self):
        rv = self.client.post('/api/navigate', json={
            'origin': 'Gate A',
            'destination': 'Food Court',
            'language': 'English'
        })
        self.assertEqual(rv.status_code, 200)
        data = json.loads(rv.data)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['origin'], 'Gate A')
        self.assertEqual(data['destination'], 'Food Court')

    def test_crowd_endpoint(self):
        rv = self.client.post('/api/crowd', json={
            'density': 'High',
            'zone': 'Gate B',
            'language': 'English'
        })
        self.assertEqual(rv.status_code, 200)
        data = json.loads(rv.data)
        self.assertEqual(data['status'], 'success')

    def test_emergency_endpoint(self):
        rv = self.client.post('/api/emergency', json={
            'type': 'Medical',
            'location': 'Concourse B',
            'language': 'English'
        })
        self.assertEqual(rv.status_code, 200)
        data = json.loads(rv.data)
        self.assertEqual(data['status'], 'emergency_logged')
        self.assertEqual(data['type'], 'Medical')

    def test_accessibility_endpoint(self):
        rv = self.client.post('/api/accessibility', json={
            'category': 'Wheelchair',
            'language': 'English'
        })
        self.assertEqual(rv.status_code, 200)

    def test_transport_endpoint(self):
        rv = self.client.post('/api/transport', json={
            'mode': 'Metro',
            'language': 'English'
        })
        self.assertEqual(rv.status_code, 200)

    def test_sustainability_endpoint(self):
        rv = self.client.get('/api/sustainability')
        self.assertEqual(rv.status_code, 200)

    def test_faq_endpoint(self):
        rv = self.client.get('/api/faq')
        self.assertEqual(rv.status_code, 200)
        data = json.loads(rv.data)
        self.assertTrue(len(data['faqs']) > 0)

    def test_dashboard_stats_endpoint(self):
        rv = self.client.get('/api/dashboard-stats')
        self.assertEqual(rv.status_code, 200)
        data = json.loads(rv.data)
        self.assertEqual(data['status'], 'success')

if __name__ == '__main__':
    unittest.main()
