const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const resolvers = {
  Query: {
    // Get all employees
    getAllEmployees: async () => {
      try {
        return await Employee.find();
      } catch (error) {
        throw new Error(`Failed to fetch employees: ${error.message}`);
      }
    },
    
    // Get a specific employee by ID
    getEmployee: async (_, { id }) => {
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error(`Employee with ID ${id} not found`);
        }
        return employee;
      } catch (error) {
        throw new Error(`Failed to fetch employee: ${error.message}`);
      }
    },
    
    // Search employees by criteria (department or position)
    searchEmployees: async (_, { criteria, value }) => {
      try {
        const query = {};
        
        // Make sure criteria is either department or position
        if (criteria !== 'department' && criteria !== 'position') {
          throw new Error('Search criteria must be either department or position');
        }
        
        // Create a case-insensitive regex search
        query[criteria] = { $regex: value, $options: 'i' };
        
        return await Employee.find(query);
      } catch (error) {
        throw new Error(`Search failed: ${error.message}`);
      }
    }
  },
  
  Mutation: {
    // User login
    login: async (_, { username, password }) => {
      try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('User not found');
        }
        
        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }
        
        // Generate and return token
        const token = generateToken(user);
        
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          token
        };
      } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
    },
    
    // User signup
    signup: async (_, { username, email, password }) => {
      try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          throw new Error('Username or email already in use');
        }
        
        // Create new user
        const user = new User({ username, email, password });
        await user.save();
        
        // Generate token
        const token = generateToken(user);
        
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          token
        };
      } catch (error) {
        throw new Error(`Signup failed: ${error.message}`);
      }
    },
    
    // Create a new employee
    createEmployee: async (_, { input }) => {
      try {
        // Check if email already exists
        const existingEmployee = await Employee.findOne({ email: input.email });
        if (existingEmployee) {
          throw new Error('An employee with this email already exists');
        }
        
        // Create new employee
        const employee = new Employee(input);
        await employee.save();
        
        return employee;
      } catch (error) {
        throw new Error(`Failed to create employee: ${error.message}`);
      }
    },
    
    // Update an existing employee
    updateEmployee: async (_, { id, input }) => {
      try {
        // Check if email already exists (if email is being changed)
        if (input.email) {
          const existingEmployee = await Employee.findOne({ 
            email: input.email,
            _id: { $ne: id } // exclude the current employee
          });
          
          if (existingEmployee) {
            throw new Error('Email is already in use by another employee');
          }
        }
        
        // Update employee
        const employee = await Employee.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true }
        );
        
        if (!employee) {
          throw new Error(`Employee with ID ${id} not found`);
        }
        
        return employee;
      } catch (error) {
        throw new Error(`Failed to update employee: ${error.message}`);
      }
    },
    
    // Delete an employee
    deleteEmployee: async (_, { id }) => {
      try {
        const result = await Employee.findByIdAndDelete(id);
        
        if (!result) {
          throw new Error(`Employee with ID ${id} not found`);
        }
        
        return true;
      } catch (error) {
        throw new Error(`Failed to delete employee: ${error.message}`);
      }
    }
  }
};

module.exports = resolvers;