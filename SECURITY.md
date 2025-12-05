# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Study Materials Platform, please email security@buildforsrilanka.org instead of using the issue tracker.

Please include:
- Description of the vulnerability
- Steps to reproduce it
- Potential impact
- Suggested fix (if any)

We will acknowledge your email within 48 hours and will send a more detailed response indicating the next steps in handling your report. After the initial reply to your report, we will endeavor to keep you informed of the progress towards a fix and full announcement.

## Security Best Practices

When using Study Materials Platform:

1. **Keep Dependencies Updated**: Regularly update to the latest versions to receive security patches
   ```bash
   npm update
   ```

2. **Environment Variables**: Never commit `.env` files. Use `.env.example` as a template

3. **Authentication**: Always use HTTPS in production

4. **Database**: Keep your Supabase credentials private and rotate them regularly

5. **Code Review**: All code changes should be reviewed before merging to main branch

## Supported Versions

| Version | Supported          | End of Support |
| ------- | ------------------ | --------------- |
| 0.1.x   | :white_check_mark: | TBD             |

## Dependencies

We use:
- Next.js 16+
- React 19+
- TypeScript 5+
- Supabase v2

Please ensure your Node.js version is 18 or higher.
