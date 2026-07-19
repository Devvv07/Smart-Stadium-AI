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
        self.assertEqual(data['persona'], 'Stadia')

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

    def test_chat_endpoint_offtopic_guardrail(self):
        rv = self.client.post('/api/chat', json={
            'prompt': 'What is the stock market price of Apple?',
            'language': 'English'
        })
        self.assertEqual(rv.status_code, 200)
        data = json.loads(rv.data)
        self.assertTrue("Stadia" in data['response'] or "stadium" in data['response'].lower())

    def test_chat_endpoint_conversation_memory(self):
        session_id = "test_session_123"
        self.client.post('/api/chat', json={'prompt': 'Where is the main Food Court?', 'session_id': session_id})
        rv2 = self.client.post('/api/chat', json={'prompt': 'Is there a washroom near that?', 'session_id': session_id})
        self.assertEqual(rv2.status_code, 200)

    def test_navigate_endpoint(self):
        rv = self.client.post('/api/navigate', json={'origin': 'Gate A', 'destination': 'Food Court'})
        self.assertEqual(rv.status_code, 200)

    def test_crowd_endpoint(self):
        rv = self.client.post('/api/crowd', json={'density': 'High', 'zone': 'Gate B'})
        self.assertEqual(rv.status_code, 200)

    def test_emergency_endpoint(self):
        rv = self.client.post('/api/emergency', json={'type': 'Medical', 'location': 'Concourse B'})
        self.assertEqual(rv.status_code, 200)

    def test_accessibility_endpoint(self):
        rv = self.client.post('/api/accessibility', json={'category': 'Wheelchair'})
        self.assertEqual(rv.status_code, 200)

    def test_transport_endpoint(self):
        rv = self.client.post('/api/transport', json={'mode': 'Metro'})
        self.assertEqual(rv.status_code, 200)

    def test_sustainability_endpoint(self):
        rv = self.client.get('/api/sustainability')
        self.assertEqual(rv.status_code, 200)

    def test_faq_endpoint(self):
        rv = self.client.get('/api/faq')
        self.assertEqual(rv.status_code, 200)

    def test_dashboard_stats_endpoint(self):
        rv = self.client.get('/api/dashboard-stats')
        self.assertEqual(rv.status_code, 200)

    def test_admin_insights_endpoint(self):
        """Test NEW POST /api/admin/insights endpoint."""
        rv = self.client.post('/api/admin/insights', json={
            'metrics': {'current_visitors': 66000, 'occupancy_rate': 94.2}
        })
        self.assertEqual(rv.status_code, 200)
        data = json.loads(rv.data)
        self.assertEqual(data['status'], 'success')
        self.assertTrue('recommendations' in data)

    def test_staff_incident_endpoint(self):
        """Test NEW POST /api/staff/incident endpoint."""
        rv = self.client.post('/api/staff/incident', json={
            'type': 'Medical Emergency',
            'details': 'Fan collapsed at Block 1'
        })
        self.assertEqual(rv.status_code, 200)
        data = json.loads(rv.data)
        self.assertEqual(data['status'], 'incident_logged')
        self.assertEqual(data['urgency'], 'CRITICAL')
        self.assertTrue('action_plan' in data)

if __name__ == '__main__':
    unittest.main()
