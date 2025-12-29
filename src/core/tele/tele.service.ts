import { Injectable } from "@nestjs/common";

// services/telegramService.js
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID; // Có thể là ID nhóm hoặc user

@Injectable()
export class TeleService {
    constructor() {}


  async sendTeleMessage  (message:any, chatId = TELEGRAM_GROUP_ID) {
    if (!TELEGRAM_BOT_TOKEN || !chatId) {
      console.warn('Telegram bot token or chat ID is missing');
      return;
    }

    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      });
    } catch (error:any) {
      console.error('❌ Error sending Telegram message:', error.message);
    }
  }

}