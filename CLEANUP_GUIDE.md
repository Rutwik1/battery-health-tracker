# Battery Health Dashboard - Code Cleanup Guide

This document provides guidance on cleaning up the codebase by identifying unused components and potential areas for optimization.

## Unused UI Components

Based on analysis of the codebase, the following UI components appear to be unused in the main application and could be considered for removal:

- `context-menu.tsx` - Not imported or used in any dashboard components
- `menubar.tsx` - Not used in the current implementation
- `hover-card.tsx` - Not used in the current dashboard UI
- `resizable.tsx` - Not actively used in our interface
- `drawer.tsx` - Not used in our current implementation
- `input-otp.tsx` - One-time password input not used in our app

## Authentication-Related Code

Our application doesn't currently implement user authentication, so these files could be reviewed:

- All authentication-related client code
- Session management-related server code

## Simplify Server Dependencies

The server includes several dependencies that are not actively used:

- Session management: `express-session` and related components
- Authentication: `passport` and `passport-local`
- Memory storage for sessions: `memorystore`

## Optimize Component Structure

Consider consolidating related components:

1. Move all chart-related components into a `/components/charts/` directory
2. Group battery-specific UI elements together
3. Consolidate related utility functions

## Data Model Optimization

- Review the schema definitions to ensure they match the actual usage
- Remove any unused fields or tables

## Style Cleanup

- Remove any unused CSS classes
- Consider consolidating similar styles

## Future Maintenance

When adding new features:
1. Use only the necessary components
2. Document usage of shared components
3. Remove any temporary code or commented-out sections

This guide is meant to help maintain clean code without disrupting the current functionality.