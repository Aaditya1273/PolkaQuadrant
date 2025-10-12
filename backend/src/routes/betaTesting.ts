/**
 * Beta Testing Routes
 * Comprehensive feedback submission, metrics tracking, and analytics
 */

import { Router, Request, Response } from 'express';
// import { createClient } from '@supabase/supabase-js';
import { initializeBetaData } from '../db/seedBetaData';

const router = Router();

// Supabase client initialization (available for future use)
// const supabaseUrl = process.env.SUPABASE_URL || 'https://temp-db.supabase.co';
// const supabaseKey = process.env.SUPABASE_KEY || 'temp-key';
// const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize with seed data
const seedData = initializeBetaData();

// In-memory storage for demo (pre-loaded with LATAM NGO tester data)
// const testersStore: any[] = [...seedData.testers];
const feedbackStore: any[] = [...seedData.feedback];
const metricsStore: any[] = [...seedData.metrics];
const surveyStore: any[] = [...seedData.surveys];

/**
 * POST /api/v1/feedback/submit
 * Submit beta testing feedback
 */
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const {
      testerId,
      testerName,
      organization,
      country,
      usabilityScore,
      featureRatings,
      comments,
      category,
      priority,
    } = req.body;

    // Validation
    if (!testerId || !testerName || !usabilityScore) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: testerId, testerName, usabilityScore',
      });
    }

    const feedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      testerId,
      testerName,
      organization,
      country,
      usabilityScore,
      featureRatings: featureRatings || {},
      comments: comments || '',
      category: category || 'general',
      priority: priority || 'medium',
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in memory (or Supabase)
    feedbackStore.push(feedback);

    // In production, save to Supabase:
    // const { data, error } = await supabase
    //   .from('beta_feedback')
    //   .insert([feedback]);

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit feedback',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/feedback/list
 * Get all feedback submissions
 */
router.get('/list', async (req: Request, res: Response) => {
  try {
    const { testerId, category, status, limit = 100 } = req.query;

    let filtered = [...feedbackStore];

    if (testerId) {
      filtered = filtered.filter(f => f.testerId === testerId);
    }
    if (category) {
      filtered = filtered.filter(f => f.category === category);
    }
    if (status) {
      filtered = filtered.filter(f => f.status === status);
    }

    filtered = filtered.slice(0, Number(limit));

    return res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch feedback',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/feedback/metrics
 * Track user metrics
 */
router.post('/metrics', async (req: Request, res: Response) => {
  try {
    const {
      testerId,
      sessionId,
      action,
      feature,
      duration,
      metadata,
    } = req.body;

    const metric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      testerId,
      sessionId: sessionId || `session_${Date.now()}`,
      action,
      feature,
      duration: duration || 0,
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
    };

    metricsStore.push(metric);

    return res.status(201).json({
      success: true,
      message: 'Metric tracked successfully',
      data: metric,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to track metric',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/feedback/metrics/:testerId
 * Get metrics for a specific tester
 */
router.get('/metrics/:testerId', async (req: Request, res: Response) => {
  try {
    const { testerId } = req.params;
    const testerMetrics = metricsStore.filter(m => m.testerId === testerId);

    // Calculate aggregated metrics
    const totalSessions = new Set(testerMetrics.map(m => m.sessionId)).size;
    const totalActions = testerMetrics.length;
    const avgDuration = testerMetrics.reduce((sum, m) => sum + m.duration, 0) / totalActions || 0;

    const featureUsage = testerMetrics.reduce((acc: any, m) => {
      acc[m.feature] = (acc[m.feature] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      success: true,
      testerId,
      summary: {
        totalSessions,
        totalActions,
        avgDuration: Math.round(avgDuration),
        featureUsage,
      },
      data: testerMetrics,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/feedback/survey
 * Submit survey response
 */
router.post('/survey', async (req: Request, res: Response) => {
  try {
    const { testerId, surveyId, responses } = req.body;

    const survey = {
      id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      testerId,
      surveyId: surveyId || 'beta_survey_v1',
      responses,
      completedAt: new Date().toISOString(),
    };

    surveyStore.push(survey);

    return res.status(201).json({
      success: true,
      message: 'Survey submitted successfully',
      data: survey,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to submit survey',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/feedback/analytics
 * Get analytics dashboard data
 */
router.get('/analytics', async (_req: Request, res: Response) => {
  try {
    const totalTesters = new Set(feedbackStore.map(f => f.testerId)).size;
    const totalFeedback = feedbackStore.length;
    const avgUsabilityScore = feedbackStore.reduce((sum, f) => sum + f.usabilityScore, 0) / totalFeedback || 0;

    // Feature ratings aggregation
    const featureRatingsAgg: any = {};
    feedbackStore.forEach(f => {
      Object.entries(f.featureRatings || {}).forEach(([feature, rating]) => {
        if (!featureRatingsAgg[feature]) {
          featureRatingsAgg[feature] = { total: 0, count: 0 };
        }
        featureRatingsAgg[feature].total += Number(rating);
        featureRatingsAgg[feature].count += 1;
      });
    });

    const featureRatings = Object.entries(featureRatingsAgg).map(([feature, data]: [string, any]) => ({
      feature,
      avgRating: data.total / data.count,
      count: data.count,
    }));

    // Category distribution
    const categoryDist = feedbackStore.reduce((acc: any, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {});

    // Priority distribution
    const priorityDist = feedbackStore.reduce((acc: any, f) => {
      acc[f.priority] = (acc[f.priority] || 0) + 1;
      return acc;
    }, {});

    // Country distribution
    const countryDist = feedbackStore.reduce((acc: any, f) => {
      acc[f.country] = (acc[f.country] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      success: true,
      analytics: {
        overview: {
          totalTesters,
          totalFeedback,
          avgUsabilityScore: Number(avgUsabilityScore.toFixed(2)),
          totalMetrics: metricsStore.length,
          totalSurveys: surveyStore.length,
        },
        featureRatings: featureRatings.sort((a, b) => b.avgRating - a.avgRating),
        distributions: {
          category: categoryDist,
          priority: priorityDist,
          country: countryDist,
        },
        recentFeedback: feedbackStore.slice(-10).reverse(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/feedback/export
 * Export feedback data (CSV/JSON)
 */
router.get('/export', async (req: Request, res: Response) => {
  try {
    const { format = 'json' } = req.query;

    if (format === 'csv') {
      // Generate CSV
      const headers = ['ID', 'Tester', 'Organization', 'Country', 'Usability Score', 'Category', 'Priority', 'Comments', 'Created At'];
      const rows = feedbackStore.map(f => [
        f.id,
        f.testerName,
        f.organization,
        f.country,
        f.usabilityScore,
        f.category,
        f.priority,
        `"${f.comments.replace(/"/g, '""')}"`,
        f.createdAt,
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=beta-feedback.csv');
      return res.send(csv);
    } else {
      // JSON export
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=beta-feedback.json');
      return res.json({
        exportedAt: new Date().toISOString(),
        totalRecords: feedbackStore.length,
        feedback: feedbackStore,
        metrics: metricsStore,
        surveys: surveyStore,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to export data',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/feedback/testers
 * Get list of all beta testers with their stats
 */
router.get('/testers', async (_req: Request, res: Response) => {
  try {
    const testerIds = [...new Set(feedbackStore.map(f => f.testerId))];
    
    const testers = testerIds.map(testerId => {
      const testerFeedback = feedbackStore.filter(f => f.testerId === testerId);
      const testerMetrics = metricsStore.filter(m => m.testerId === testerId);
      
      const firstFeedback = testerFeedback[0];
      const avgUsability = testerFeedback.reduce((sum, f) => sum + f.usabilityScore, 0) / testerFeedback.length;
      
      return {
        testerId,
        name: firstFeedback?.testerName || 'Unknown',
        organization: firstFeedback?.organization || 'Unknown',
        country: firstFeedback?.country || 'Unknown',
        stats: {
          totalFeedback: testerFeedback.length,
          avgUsabilityScore: Number(avgUsability.toFixed(2)),
          totalActions: testerMetrics.length,
          lastActive: testerFeedback[testerFeedback.length - 1]?.createdAt || null,
        },
      };
    });

    return res.json({
      success: true,
      count: testers.length,
      data: testers,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch testers',
      message: error.message,
    });
  }
});

export default router;
