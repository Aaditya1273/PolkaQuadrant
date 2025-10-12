-- Beta Testing Database Schema for Supabase
-- Comprehensive schema for feedback, metrics, and survey tracking

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Beta Testers Table
CREATE TABLE IF NOT EXISTS beta_testers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tester_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  organization VARCHAR(255),
  country VARCHAR(100),
  role VARCHAR(100),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beta Feedback Table
CREATE TABLE IF NOT EXISTS beta_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id VARCHAR(100) UNIQUE NOT NULL,
  tester_id VARCHAR(100) REFERENCES beta_testers(tester_id) ON DELETE CASCADE,
  usability_score DECIMAL(3,2) CHECK (usability_score >= 0 AND usability_score <= 5),
  feature_ratings JSONB DEFAULT '{}'::jsonb,
  comments TEXT,
  category VARCHAR(100) DEFAULT 'general',
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'new',
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Metrics Table
CREATE TABLE IF NOT EXISTS user_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_id VARCHAR(100) UNIQUE NOT NULL,
  tester_id VARCHAR(100) REFERENCES beta_testers(tester_id) ON DELETE CASCADE,
  session_id VARCHAR(100) NOT NULL,
  action VARCHAR(255) NOT NULL,
  feature VARCHAR(255),
  duration INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Survey Responses Table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id VARCHAR(100) UNIQUE NOT NULL,
  tester_id VARCHAR(100) REFERENCES beta_testers(tester_id) ON DELETE CASCADE,
  survey_id VARCHAR(100) NOT NULL,
  responses JSONB NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feature Requests Table
CREATE TABLE IF NOT EXISTS feature_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id VARCHAR(100) UNIQUE NOT NULL,
  tester_id VARCHAR(100) REFERENCES beta_testers(tester_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'pending',
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bug Reports Table
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bug_id VARCHAR(100) UNIQUE NOT NULL,
  tester_id VARCHAR(100) REFERENCES beta_testers(tester_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'open',
  steps_to_reproduce TEXT,
  environment JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_feedback_tester ON beta_feedback(tester_id);
CREATE INDEX idx_feedback_category ON beta_feedback(category);
CREATE INDEX idx_feedback_status ON beta_feedback(status);
CREATE INDEX idx_feedback_created ON beta_feedback(created_at DESC);

CREATE INDEX idx_metrics_tester ON user_metrics(tester_id);
CREATE INDEX idx_metrics_session ON user_metrics(session_id);
CREATE INDEX idx_metrics_feature ON user_metrics(feature);
CREATE INDEX idx_metrics_timestamp ON user_metrics(timestamp DESC);

CREATE INDEX idx_survey_tester ON survey_responses(tester_id);
CREATE INDEX idx_survey_id ON survey_responses(survey_id);

CREATE INDEX idx_feature_requests_status ON feature_requests(status);
CREATE INDEX idx_bug_reports_status ON bug_reports(status);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_beta_testers_updated_at BEFORE UPDATE ON beta_testers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beta_feedback_updated_at BEFORE UPDATE ON beta_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_requests_updated_at BEFORE UPDATE ON feature_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bug_reports_updated_at BEFORE UPDATE ON bug_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE beta_testers IS 'Beta testing program participants';
COMMENT ON TABLE beta_feedback IS 'User feedback submissions';
COMMENT ON TABLE user_metrics IS 'User interaction and usage metrics';
COMMENT ON TABLE survey_responses IS 'Survey response data';
COMMENT ON TABLE feature_requests IS 'Feature requests from beta testers';
COMMENT ON TABLE bug_reports IS 'Bug reports from beta testers';
