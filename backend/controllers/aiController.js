// controllers/aiController.js - AI Recommendation Engine using OpenAI

const OpenAI = require("openai");
const Employee = require("../models/Employee");

// Initialize OpenAI client (API key loaded from environment variable)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ─── @desc    Generate AI recommendation for a specific employee
// ─── @route   POST /api/ai/recommend
// ─── @access  Private
const getAIRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: "Employee ID is required" });
    }

    // Fetch employee data from database
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Build a descriptive prompt for OpenAI
    const prompt = `
You are an expert HR analytics AI assistant. Analyze the following employee profile and provide a comprehensive performance analysis.

Employee Profile:
- Name: ${employee.name}
- Department: ${employee.department}
- Skills: ${employee.skills.join(", ")}
- Performance Score: ${employee.performanceScore}/100
- Years of Experience: ${employee.yearsOfExperience} years

Based on this data, provide:

1. **Promotion Recommendation**: Should this employee be considered for promotion? Justify with reasons.

2. **Performance Ranking**: Rate this employee as Top Performer / Good Performer / Average Performer / Needs Improvement, with explanation.

3. **Training Suggestions**: List 3-5 specific training programs or courses that would help this employee grow.

4. **AI Feedback**: Provide constructive feedback highlighting strengths and areas of improvement.

5. **Action Plan**: Suggest a short 90-day action plan for career development.

Keep the response professional, encouraging, and data-driven.
    `.trim();

    // Call OpenAI Chat Completion API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert HR analytics AI that provides professional, data-driven employee performance recommendations. Always be constructive and encouraging.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const recommendation = completion.choices[0].message.content;

    // Save the AI recommendation back to the employee record
    await Employee.findByIdAndUpdate(employeeId, {
      aiRecommendation: recommendation,
      lastAnalyzed: new Date(),
    });

    res.json({
      success: true,
      message: "AI recommendation generated successfully",
      data: {
        employee: {
          _id: employee._id,
          name: employee.name,
          department: employee.department,
          performanceScore: employee.performanceScore,
        },
        recommendation,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Handle OpenAI specific errors gracefully
    if (error.code === "insufficient_quota") {
      return res.status(402).json({
        success: false,
        message: "OpenAI quota exceeded. Please check your API key billing.",
      });
    }
    if (error.code === "invalid_api_key") {
      return res.status(401).json({
        success: false,
        message: "Invalid OpenAI API key. Please check your configuration.",
      });
    }
    next(error);
  }
};

// ─── @desc    Rank all employees using AI
// ─── @route   POST /api/ai/rank-all
// ─── @access  Private
const rankAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().select("name department performanceScore yearsOfExperience skills");

    if (employees.length === 0) {
      return res.status(400).json({ success: false, message: "No employees found to rank" });
    }

    // Build a comparative analysis prompt
    const employeeList = employees
      .map(
        (e, i) =>
          `${i + 1}. ${e.name} | ${e.department} | Score: ${e.performanceScore}/100 | Experience: ${e.yearsOfExperience} yrs | Skills: ${e.skills.join(", ")}`
      )
      .join("\n");

    const prompt = `
You are an expert HR AI. Analyze and rank the following employees based on their performance scores, experience, and skills.

Employees:
${employeeList}

Provide:
1. Overall ranking from best to least performer
2. Top 3 employees recommended for promotion
3. Employees who need immediate training/support
4. A brief comparative summary

Format your response clearly with sections.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert HR analyst AI providing objective employee ranking and analysis.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.5,
    });

    const ranking = completion.choices[0].message.content;

    res.json({
      success: true,
      message: "Employee ranking generated successfully",
      data: {
        totalEmployees: employees.length,
        ranking,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAIRecommendation, rankAllEmployees };
