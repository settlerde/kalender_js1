// Lädt Feiertage aus der API
async function loadHolidays(year) {
    try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/DE`);
        holidays = await res.json();
        
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const currentHoliday = holidays.find(h => h.date === todayStr);
        const banner = document.getElementById('holiday-banner');

        if (banner) {
            const stilleTage = ["Karfreitag", "Allerheiligen", "Volkstrauertag", "Totensonntag"];
            if (currentHoliday) {
                let msg = `🎉 HEUTE: ${currentHoliday.localName}`;
                if (stilleTage.some(t => currentHoliday.name.includes(t))) msg += " 🤫 (Stiller Tag)";
                banner.innerHTML = `<div class="marquee">${msg}</div>`;
                banner.className = 'active-holiday';
            } else {
                banner.innerHTML = `<div class="marquee">📡 STATUS: Heute gibt es keine Feiertage.</div>`;
                banner.className = 'no-holiday';
            }

            banner.style.display = 'block';
            banner.style.opacity = '1';
            setTimeout(() => {
                banner.style.opacity = '0';
                setTimeout(() => { banner.style.display = 'none'; }, 1000);
            }, 10000);
        }
        render(); 
    } catch (err) {
        console.error("API Fehler", err);
        render();
    }
}

// Lädt historische Ereignisse von Wikipedia
async function showDayEvent(day, month) {
    // Parameter wurden nicht übergeben, es wird der erste oder der aktuelle Tag verwendet.
    if (!day || !month) {
        day = (currentDisplayDate.getMonth() === new Date().getMonth()) ? new Date().getDate() : 1;
        month = currentDisplayDate.getMonth() + 1;
    }

    const url = `https://de.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
    const el = document.getElementById('ereignisse'); 
    
    if (!el) return;
    el.innerHTML = "Lade Ereignisse..."; 

    try {
        const res = await fetch(url);
        const data = await res.json();

        let filtered = data.events.filter(ev => ev.selected);
        if (filtered.length === 0) filtered = data.events;

        const topEvents = filtered
            .sort(() => Math.random() - 0.5)
            .slice(0, 5)
            .sort((a, b) => a.year - b.year);
        
        el.innerHTML = topEvents
            // Umwandlung eines Arrays in eine Zeichenkette
            .map(ev => `<div class="event-item" style="margin-bottom: 1rem; border-left: 0.1rem solid #f00797; padding-left: 1rem;">
                            <b style="color: #f00797;">${ev.year}</b>: ${ev.text}
                        </div>`).join('');
            
    } catch (err) {
        el.innerText = "Keine Daten gefunden.";
    }
}