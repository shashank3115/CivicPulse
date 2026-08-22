from langdetect import detect
import re

class NLPService:
    def detect_language(self, text: str) -> str:
        try:
            lang = detect(text)
            if lang in ['en', 'hi', 'mr']:
                return lang
            return 'unknown'
        except:
            return 'unknown'

    def categorize_complaint(self, text: str) -> str:
        t = text.lower()
        categories = {
            'Water & Sanitation': ['water', 'pipe', 'supply', 'drain', 'sewage', 'पानी', 'नल', 'जल', 'पाणी', 'नळ', 'leak', 'गळत'],
            'Roads': ['road', 'pothole', 'highway', 'सड़क', 'रास्ता', 'रस्ता', 'खड्डा'],
            'Electricity': ['power', 'electricity', 'outage', 'बिजली', 'वीज', 'current'],
            'Public Transport': ['bus', 'train', 'metro', 'बस', 'ट्रेन', 'transport'],
            'Healthcare Infrastructure': ['hospital', 'clinic', 'अस्पताल', 'रुग्णालय', 'health', 'doctor'],
            'Waste Management': ['garbage', 'waste', 'कचरा', 'dump'],
            'Street Lighting': ['light', 'lamp', 'streetlight', 'बत्ती', 'दिवा'],
            'Drainage': ['flood', 'drain', 'waterlog', 'नाला', 'गटार']
        }
        
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in t:
                    return category
        return 'Other'

    def assess_urgency(self, text: str) -> str:
        t = text.lower()
        critical_words = ['emergency', 'danger', 'death', 'collapse', 'आपात', 'धोका', 'मृत्यु', 'मरण']
        high_words = ['broken', 'severe', 'week', 'खराब', 'गंभीर', 'आठवडा', 'हफ्ता']
        medium_words = ['problem', 'issue', 'समस्या', 'अडचण', 'त्रास']
        
        for w in critical_words:
            if w in t:
                return 'critical'
        for w in high_words:
            if w in t:
                return 'high'
        for w in medium_words:
            if w in t:
                return 'medium'
        return 'low'

    def assess_sentiment(self, text: str) -> str:
        t = text.lower()
        negative_words = ['bad', 'terrible', 'worst', 'angry', 'frustrated', 'poor', 'खराब', 'वाईट', 'भयंकर', 'त्रास', 'गुस्सा']
        positive_words = ['good', 'great', 'thanks', 'resolved', 'अच्छा', 'चांगले', 'धन्यवाद']
        
        neg_count = sum(1 for w in negative_words if w in t)
        pos_count = sum(1 for w in positive_words if w in t)
        
        if neg_count > pos_count:
            return 'negative'
        elif pos_count > neg_count:
            return 'positive'
        return 'neutral'

nlp_service = NLPService()
