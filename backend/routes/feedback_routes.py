from flask import Blueprint, request
from utils.response_formatter import success_response, error_response
import requests
import os

feedback_bp = Blueprint("feedback_bp", __name__)

MJ_PUBLIC  = os.getenv("MJ_PUBLIC")
MJ_PRIVATE = os.getenv("MJ_PRIVATE")
TO_EMAIL   = "edubridge617@gmail.com"
TO_NAME    = "EduBridge Team"

@feedback_bp.route("/feedback", methods=["POST"])
def send_feedback():
    data     = request.get_json() or {}
    name     = data.get("name", "Anonymous")
    email    = data.get("email", "Not provided")
    category = data.get("category", "general")
    message  = data.get("message", "")

    if not message.strip():
        return error_response("Message is required", 400)

    try:
        res = requests.post(
            "https://api.mailjet.com/v3.1/send",
            auth=(MJ_PUBLIC, MJ_PRIVATE),
            json={
                "Messages": [{
                    "From": {"Email": "edubridge617@gmail.com", "Name": "EduBridge Feedback"},
                    "To":   [{"Email": TO_EMAIL, "Name": TO_NAME}],
                    "Subject": f"[EduBridge Feedback] {category.title()} — {name}",
                    "TextPart": f"Name: {name}\nEmail: {email}\nCategory: {category}\n\nMessage:\n{message}",
                    "HTMLPart": f"""
                        <div style="font-family:Inter,sans-serif;max-width:600px;padding:24px;background:#F1FAFF;border-radius:12px;">
                          <h2 style="color:#112F4D;margin-bottom:4px;">EduBridge Feedback</h2>
                          <p style="color:#4CAEE1;font-size:13px;margin-bottom:20px;">{category.title()}</p>
                          <table style="width:100%;font-size:14px;color:#112F4D;">
                            <tr><td style="padding:5px 0;font-weight:600;width:80px;">Name</td><td>{name}</td></tr>
                            <tr><td style="padding:5px 0;font-weight:600;">Email</td><td>{email}</td></tr>
                          </table>
                          <div style="margin-top:16px;padding:16px;background:white;border-radius:8px;border:1px solid #D0E9F7;">
                            <p style="font-size:13px;color:#4A6A85;margin:0;line-height:1.7;">{message.replace(chr(10), '<br>')}</p>
                          </div>
                        </div>
                    """,
                }]
            }
        )

        if res.status_code != 200:
            return error_response(f"Mailjet error: {res.text}", 500)

        return success_response({"sent": True})

    except Exception as e:
        return error_response(str(e), 500)