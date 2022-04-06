export default class Player {
  constructor(session_id) {
    this.callbacks = {};
    this.session_id = session_id;
  }

  async login(key) {
    const resp = await fetch(
      `https://custom.teachbase.local/api/v2/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key,
        }),
        referrer: 'no-referrer',
        credentials: 'include',
        mode: 'cors'
      }
    ); 
    const json = await resp.json();
    this.csrf = json.csrf
    return await json
  }

  openMaterial(id) {
    this.close();
    this.track = setInterval(this.trackMaterial, 5000, id, this);
    this.notify("openMaterial", true)
  }

  close() {
    if (this.track) {
      clearInterval(this.track);
    };
    this.notify("openMaterial", false)
  }

  trackMaterial(id, context) {
    const ts = 5;
    
    fetch(
      `https://custom.teachbase.local/api/v2/course_sessions/${context.session_id}/materials/${id}/track`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-csrf-token": context.csrf
        },
        body: JSON.stringify({
          ts,
        }),
        referrer: 'no-referrer',
        credentials: 'include',
        mode: 'cors'
      }
    ).then(()=> context.notify("passed", id))
  }

  on(event, func) {
    this.callbacks[event] ||= [];
    this.callbacks[event].push(func);
    return event
  }

  notify(event, payload) {
    const funcs = this.callbacks[event] || [];
    funcs.forEach(f => {
      f(payload)
    });
  }

  async getCourse() {
    const res = await fetch(
      `https://custom.teachbase.local/api/v2/course_sessions/${this.session_id}/take`,
      {
        credentials: 'include',
        referrer: 'no-referrer',
        credentials: 'include',
        mode: 'cors'
      }
    );
    return await res.json();
  }
}
