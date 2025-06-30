import Category from '../models/Category.js';
import xlsx from 'xlsx';

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

// In your categoryController.js
export const getCategoriesCount = async (req, res, next) => {
  try {
    const count = await Category.countDocuments();
    res.status(200).json({
      success: true,
      data: {
        count
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};





export const uploadCategories = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Read the Excel file from buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Validate required fields
    const requiredFields = ['name', 'description', 'difficulty', 'hoursRequired'];
    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Empty Excel file'
      });
    }

    const missingFields = requiredFields.filter(field => !data[0].hasOwnProperty(field));
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Process each row
    let createdCount = 0;
    const errors = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Validate difficulty
        const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
        const difficulty = validDifficulties.includes(row.difficulty) 
          ? row.difficulty 
          : 'Intermediate';

        // Create category
        await Category.create({
          name: row.name,
          description: row.description,
          imageUrl: row.imageUrl || '',
          difficulty: difficulty,
          hoursRequired: Number(row.hoursRequired) || 0
        });

        createdCount++;
      } catch (err) {
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    res.status(201).json({
      success: true,
      count: createdCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully processed ${createdCount} categories${errors.length > 0 ? ` (${errors.length} errors)` : ''}`
    });
  } catch (err) {
    next(err);
  }
};