import random
from datetime import datetime, timedelta
from backend.database import SessionLocal, engine
from backend.models.database_models import Base, District, Complaint
from backend.services.nlp_service import nlp_service
from backend.services.clustering_service import clustering_service
from backend.services.priority_service import priority_service

def create_districts(db):
    districts_data = [
        {"name": "Dharavi (Mumbai)", "lat": 19.0422, "lng": 72.8515, "pop": 1000000, "w": 0.45, "s": 0.38, "r": 0.52, "e": 0.61, "t": 0.55, "h": 0.48, "gap": 0.78, "inv": 12.5},
        {"name": "Pune", "lat": 18.5204, "lng": 73.8567, "pop": 3124000, "w": 0.72, "s": 0.68, "r": 0.58, "e": 0.75, "t": 0.62, "h": 0.70, "gap": 0.52, "inv": 45.0},
        {"name": "Nagpur", "lat": 21.1458, "lng": 79.0882, "pop": 2405000, "w": 0.65, "s": 0.60, "r": 0.48, "e": 0.70, "t": 0.45, "h": 0.55, "gap": 0.61, "inv": 28.0},
        {"name": "Nashik", "lat": 19.9975, "lng": 73.7898, "pop": 1486000, "w": 0.58, "s": 0.52, "r": 0.55, "e": 0.68, "t": 0.40, "h": 0.50, "gap": 0.65, "inv": 18.5},
        {"name": "Thane", "lat": 19.2183, "lng": 72.9781, "pop": 1841000, "w": 0.70, "s": 0.65, "r": 0.62, "e": 0.78, "t": 0.68, "h": 0.65, "gap": 0.48, "inv": 38.0},
        {"name": "Chhatrapati Sambhajinagar", "lat": 19.8762, "lng": 75.3433, "pop": 1175000, "w": 0.50, "s": 0.45, "r": 0.42, "e": 0.62, "t": 0.35, "h": 0.42, "gap": 0.72, "inv": 15.0},
        {"name": "Solapur", "lat": 17.6599, "lng": 75.9064, "pop": 951000, "w": 0.55, "s": 0.48, "r": 0.50, "e": 0.65, "t": 0.38, "h": 0.45, "gap": 0.68, "inv": 10.0},
        {"name": "Kolhapur", "lat": 16.7050, "lng": 74.2433, "pop": 549000, "w": 0.75, "s": 0.72, "r": 0.65, "e": 0.80, "t": 0.55, "h": 0.68, "gap": 0.42, "inv": 22.0},
        {"name": "Amravati", "lat": 20.9320, "lng": 77.7523, "pop": 646000, "w": 0.48, "s": 0.42, "r": 0.40, "e": 0.58, "t": 0.30, "h": 0.38, "gap": 0.75, "inv": 8.0},
        {"name": "Sangli", "lat": 16.8524, "lng": 74.5815, "pop": 436000, "w": 0.68, "s": 0.62, "r": 0.58, "e": 0.72, "t": 0.45, "h": 0.55, "gap": 0.50, "inv": 14.0},
        {"name": "Jalgaon", "lat": 21.0077, "lng": 75.5626, "pop": 460000, "w": 0.52, "s": 0.46, "r": 0.44, "e": 0.60, "t": 0.32, "h": 0.40, "gap": 0.70, "inv": 9.5},
        {"name": "Latur", "lat": 18.3916, "lng": 76.5604, "pop": 382000, "w": 0.42, "s": 0.38, "r": 0.38, "e": 0.55, "t": 0.28, "h": 0.35, "gap": 0.80, "inv": 6.5}
    ]
    
    districts = []
    for d in districts_data:
        dist = District(
            name=d["name"], state="Maharashtra", population=d["pop"], latitude=d["lat"], longitude=d["lng"],
            water_access=d["w"], sanitation_access=d["s"], road_quality=d["r"], electricity_reliability=d["e"],
            public_transport_access=d["t"], healthcare_access=d["h"], infrastructure_gap=d["gap"], planned_investment=d["inv"]
        )
        db.add(dist)
        districts.append(dist)
    db.commit()
    return districts

def get_complaint_templates():
    return {
        "Water & Sanitation": {
            "en": ["Water supply has been unreliable for the past two weeks.", "The main pipeline in our area has been leaking for days.", "We receive water only twice a week, which is insufficient.", "Drainage water is mixing with drinking water.", "Public toilets are overflowing.", "No water pressure in taps.", "Severe water logging after minor rain.", "Sewer line is blocked and smelling.", "Yellow colored water coming from taps.", "Need a new water tank in our locality."],
            "hi": ["पिछले दो हफ्तों से पानी की सप्लाई ठीक नहीं है।", "हमारे इलाके में मुख्य पाइपलाइन से कई दिनों से पानी रिस रहा है।", "हमें हफ्ते में सिर्फ दो बार पानी मिलता है।", "पीने के पानी में नाले का पानी मिल रहा है।", "सार्वजनिक शौचालय भर गए हैं।", "नल में पानी का प्रेशर नहीं है।", "थोड़ी बारिश के बाद जलभराव हो जाता है।", "सीवर लाइन ब्लॉक है और बदबू आ रही है।", "नल से पीला पानी आ रहा है।", "हमारे इलाके में पानी की नई टंकी चाहिए।"],
            "mr": ["गेल्या दोन आठवड्यांपासून पाण्याचा पुरवठा अनियमित आहे.", "आमच्या भागातील मुख्य पाइपलाइनमधून पाणी गळत आहे.", "आम्हाला आठवड्यातून फक्त दोनदा पाणी मिळते.", "पिण्याच्या पाण्यात गटाराचे पाणी मिसळत आहे.", "सार्वजनिक शौचालये भरून वाहत आहेत.", "नळाला पाण्याचा दाब नाही.", "थोड्या पावसानंतर पाणी साचते.", "गटार तुंबली आहे आणि दुर्गंधी येत आहे.", "नळातून पिवळ्या रंगाचे पाणी येत आहे.", "आमच्या भागात नवीन पाण्याची टाकी हवी आहे."]
        },
        "Roads": {
            "en": ["Roads are full of potholes.", "Highway construction is creating massive dust.", "Street is dug up and left incomplete.", "Need speed breakers near school.", "Asphalt is melting in summer.", "Road collapsed due to heavy rain.", "Traffic congestion due to narrow road.", "Pavement is occupied by hawkers."],
            "hi": ["सड़कें गड्ढों से भरी हैं।", "हाइवे निर्माण से बहुत धूल उड़ रही है।", "सड़क खोदी गई और अधूरी छोड़ दी गई।", "स्कूल के पास स्पीड ब्रेकर चाहिए।", "गर्मियों में डामर पिघल रहा है।", "भारी बारिश के कारण सड़क धंस गई।", "संकरी सड़क के कारण ट्रैफिक जाम।", "फुटपाथ पर फेरीवालों का कब्ज़ा है।"],
            "mr": ["रस्त्यांवर खड्डेच खड्डे आहेत.", "महामार्ग बांधकामामुळे खूप धूळ उडत आहे.", "रस्ता खोदून अर्धवट सोडला आहे.", "शाळेजवळ स्पीड ब्रेकर हवा आहे.", "उन्हाळ्यात डांबर वितळत आहे.", "मुसळधार पावसामुळे रस्ता खचला.", "अरुंद रस्त्यामुळे वाहतूक कोंडी.", "पदपथावर फेरीवाल्यांनी अतिक्रमण केले आहे."]
        },
        "Electricity": {
             "en": ["Frequent power outages every night.", "Voltage fluctuations damaging appliances.", "Electric pole is leaning dangerously.", "Transformer sparking occasionally.", "Street wires hanging too low.", "Power cut without prior notice.", "Meters are showing wrong readings.", "Waiting for new connection for months."],
             "hi": ["रोज रात को बिजली जाती है।", "वोल्टेज के उतार-चढ़ाव से उपकरण खराब हो रहे हैं।", "बिजली का खंभा खतरनाक रूप से झुका है।", "ट्रांसफॉर्मर से चिंगारी निकलती है।", "सड़क पर तार बहुत नीचे लटक रहे हैं।", "बिना सूचना के बिजली कटौती।", "मीटर गलत रीडिंग दिखा रहे हैं।", "महीनों से नए कनेक्शन का इंतजार है।"],
             "mr": ["रोज रात्री वीज जाते.", "व्होल्टेजच्या चढ-उतारांमुळे उपकरणे खराब होत आहेत.", "विजेचा खांब धोकादायक स्थितीत झुकला आहे.", "ट्रान्सफॉर्मरमधून ठिणग्या उडत आहेत.", "रस्त्यावरील वायर्स खूप खाली लटकत आहेत.", "पूर्वसूचनेशिवाय वीज कपात.", "मीटर चुकीचे रीडिंग दाखवत आहेत.", "नवीन कनेक्शनसाठी महिन्यांपासून प्रतीक्षा."]
        },
        "Public Transport": {
             "en": ["Bus is always late.", "Metro construction causing traffic.", "Need more local trains during peak hours.", "Bus stand has no shelter.", "Rickshaw drivers overcharging.", "Buses are extremely crowded.", "No direct bus to hospital.", "Condition of local bus is pathetic."],
             "hi": ["बस हमेशा लेट आती है।", "मेट्रो निर्माण से ट्रैफिक जाम।", "भीड़ के समय ज्यादा लोकल ट्रेनें चाहिए।", "बस स्टैंड पर शेड नहीं है।", "रिक्शा वाले ज्यादा किराया मांग रहे हैं।", "बसों में बहुत भीड़ होती है।", "अस्पताल के लिए कोई सीधी बस नहीं।", "लोकल बस की हालत खस्ता है।"],
             "mr": ["बस नेहमी उशिरा येते.", "मेट्रोच्या कामामुळे वाहतूक कोंडी.", "गर्दीच्या वेळी अधिक लोकल ट्रेन हव्या आहेत.", "बस स्टँडवर निवारा नाही.", "रिक्षाचालक जास्त भाडे आकारत आहेत.", "बसेसमध्ये प्रचंड गर्दी असते.", "रुग्णालयासाठी थेट बस नाही.", "लोकल बसची अवस्था दयनीय आहे."]
        },
        "Healthcare Infrastructure": {
             "en": ["Government hospital lacks doctors.", "Medicines are unavailable at clinic.", "Ambulance took hours to reach.", "Hospital wards are very unhygienic.", "Need a primary health center in village.", "X-ray machine is broken for weeks.", "Long queues for basic treatment.", "Staff behavior is very bad."],
             "hi": ["सरकारी अस्पताल में डॉक्टर नहीं हैं।", "क्लीनिक में दवाइयां उपलब्ध नहीं हैं।", "एंबुलेंस को पहुंचने में घंटों लग गए।", "अस्पताल के वार्ड बहुत अस्वच्छ हैं।", "गांव में प्राथमिक स्वास्थ्य केंद्र चाहिए।", "एक्स-रे मशीन हफ्तों से खराब है।", "बेसिक इलाज के लिए लंबी कतारें।", "कर्मचारियों का व्यवहार बहुत खराब है।"],
             "mr": ["सरकारी रुग्णालयात डॉक्टर नाहीत.", "दवाखान्यात औषधे उपलब्ध नाहीत.", "रुग्णवाहिकेला पोहोचायला तास लागले.", "रुग्णालयाचे वॉर्ड अतिशय अस्वच्छ आहेत.", "गावात प्राथमिक आरोग्य केंद्र हवे आहे.", "क्ष-किरण यंत्र आठवड्यांपासून बंद आहे.", "प्राथमिक उपचारांसाठी लांबच लांब रांगा.", "कर्मचाऱ्यांचे वर्तन अत्यंत वाईट आहे."]
        },
        "Waste Management": {
             "en": ["Garbage not collected for 3 days.", "Trash overflowing from bin.", "People burning plastic waste.", "Need regular sweeping of streets.", "Stray animals spreading garbage.", "Dumpyard smell reaching homes.", "No separate bins for dry/wet waste.", "Garbage truck skips our lane."],
             "hi": ["3 दिन से कचरा नहीं उठाया गया।", "कचरे के डिब्बे से कचरा बाहर गिर रहा है।", "लोग प्लास्टिक का कचरा जला रहे हैं।", "सड़कों की नियमित सफाई चाहिए।", "आवारा जानवर कचरा फैला रहे हैं।", "डंपयार्ड की बदबू घरों तक आ रही है।", "सूखे/गीले कचरे के लिए अलग डिब्बे नहीं।", "कचरे की गाड़ी हमारी गली छोड़ देती है।"],
             "mr": ["३ दिवसांपासून कचरा उचलला नाही.", "कचराकुंडीतून कचरा बाहेर सांडत आहे.", "लोक प्लास्टिकचा कचरा जाळत आहेत.", "रस्त्यांची नियमित साफसफाई हवी.", "भटकी जनावरे कचरा पसरवत आहेत.", "डंपिंग ग्राउंडची दुर्गंधी घरापर्यंत येत आहे.", "ओल्या/सुक्या कचऱ्यासाठी वेगळ्या कुंड्या नाहीत.", "कचऱ्याची गाडी आमच्या गल्लीत येत नाही."]
        }
    }

def generate_complaints(db, districts, count=1000):
    templates = get_complaint_templates()
    categories = list(templates.keys())
    
    dist_weights = [d.infrastructure_gap for d in districts]
    total_w = sum(dist_weights)
    dist_weights = [w/total_w for w in dist_weights]
    
    langs = ['en', 'hi', 'mr']
    lang_weights = [0.45, 0.35, 0.20]
    
    complaints = []
    
    for _ in range(count):
        d = random.choices(districts, weights=dist_weights, k=1)[0] if random.random() > 0.1 else random.choice(districts)
        c = random.choice(categories)
        l = random.choices(langs, weights=lang_weights)[0]
        
        text = random.choice(templates[c][l])
        
        detected_lang = nlp_service.detect_language(text)
        cat = nlp_service.categorize_complaint(text)
        urgency = nlp_service.assess_urgency(text)
        sentiment = nlp_service.assess_sentiment(text)
        
        date_offset = random.randint(0, 365)
        created_at = datetime.utcnow() - timedelta(days=date_offset)
        
        comp = Complaint(
            text=text,
            language=l,
            detected_language=detected_lang,
            district_id=d.id,
            category=cat,
            sentiment=sentiment,
            urgency=urgency,
            embedding_status="fallback",
            normalized_text=text.lower().strip(),
            created_at=created_at
        )
        db.add(comp)
        d.complaint_count += 1
        complaints.append(comp)
        
    db.commit()
    return complaints

def seed_database():
    db = SessionLocal()
    try:
        if db.query(District).count() > 0:
            print("Database already seeded.")
            return

        print("Creating districts...")
        districts = create_districts(db)
        
        print("Generating complaints...")
        generate_complaints(db, districts)
        
        print("Calculating priorities...")
        priority_service.recalculate_all_priorities(db, 0.45, 0.40, 0.15)
        
        print("Clustering complaints...")
        clustering_service.update_clusters(db)
        
        print("Seed complete.")
    finally:
        db.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_database()
