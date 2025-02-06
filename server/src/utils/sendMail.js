import mailjet from 'node-mailjet';
import AppError from './appError.js';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sendMail(from, to, subject, templateName, templateData) {
  try {
    const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    const html = template(templateData);

    const client = mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE
    );
    
    const request = client.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: from,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });

    const result = await request;
    return result.body; 
  } catch (err) {
    console.error(err.message);
    throw new AppError('Failed to send email', 500); 
  }
}

export default sendMail;