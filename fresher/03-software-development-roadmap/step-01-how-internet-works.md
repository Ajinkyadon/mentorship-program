# Step 01: How the Internet Works
### "Jab tum google.com type karte ho — actually kya hota hai?"

---

## Why This Matters

Ye sirf theory nahi hai — ye interviews mein directly poocha jaata hai:
- "HTTP aur HTTPS mein kya fark hai?"
- "DNS kya karta hai?"
- "TCP aur UDP mein difference?"
- "Browser se request kaise jaati hai server tak?"

Aur practically: jab production bug aata hai, ye fundamentals samajhne se hi diagnose hota hai.

---

## 1. The Internet — Basic Concept

Internet = **Duniya bhar ke computers ka ek network.**

Har computer/server ka ek **IP address** hota hai — jaise ghar ka address.

```
Tumhara laptop: 192.168.1.5 (local / private)
Google ka server: 142.250.77.46 (public)
```

**IP Address types:**
```
IPv4: 192.168.1.1       (32-bit, ~4 billion addresses — running out)
IPv6: 2001:db8::1       (128-bit, virtually unlimited)
```

---

## 2. DNS — Domain Name System

Humans IP addresses yaad nahi kar sakte. Isliye **DNS** hai.

DNS ek **phone book** ki tarah hai — naam se IP dhundh deta hai.

### DNS Resolution Process
```
Step 1: Tum browser mein "google.com" type karte ho

Step 2: Browser apna cache check karta hai
        → Pehle visit kiya tha? Cached IP use karo
        → Nahi? Next step

Step 3: OS ka cache check hota hai
        → /etc/hosts file (local overrides)

Step 4: Recursive DNS Resolver se poocha jaata hai
        → Ye tumhara ISP (Airtel/Jio) provide karta hai
        → Ya Google's: 8.8.8.8, Cloudflare's: 1.1.1.1

Step 5: Root Name Servers
        → ".com" zone ke liye kaun responsible hai?
        → Reply: ".com" TLD server ka address

Step 6: TLD (Top-Level Domain) Server
        → "google.com" ke liye kaun responsible hai?
        → Reply: Google's authoritative nameserver

Step 7: Authoritative Name Server
        → "google.com" ka IP kya hai?
        → Reply: 142.250.77.46

Step 8: IP wapas browser ko milta hai
Step 9: Response cache hota hai (TTL tak)
```

### DNS Record Types
| Record | Kya karta hai | Example |
|--------|--------------|---------|
| A | Domain → IPv4 address | google.com → 142.250.77.46 |
| AAAA | Domain → IPv6 address | google.com → 2607:f8b0::... |
| CNAME | Domain → Doosra domain | www → google.com |
| MX | Mail server | gmail.com → mail servers |
| TXT | Text data | Domain verification, SPF records |
| NS | Nameserver | Authoritative DNS server |

### DNS TTL (Time To Live)
```
Har DNS record ka ek TTL hota hai (seconds mein).
TTL = 3600 → 1 ghante tak cached rahega
TTL = 300  → 5 min cache

Agar tum domain ka IP change karo:
  → Naya IP propagate hone mein TTL jitna time lagta hai
  → Isliye "DNS propagation" 24-48 hours tak le sakti hai
```

---

## 3. HTTP — HyperText Transfer Protocol

**HTTP = Client aur server ke beech baat karne ke rules.**

### HTTP Request Structure
```
GET /api/users HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbG...
Content-Type: application/json
Accept: application/json

[Request Body — only for POST/PUT/PATCH]
{"name": "Rahul", "email": "rahul@example.com"}
```

**Parts:**
- **Method** — GET, POST, PUT, PATCH, DELETE
- **Path** — /api/users
- **HTTP Version** — HTTP/1.1 ya HTTP/2
- **Headers** — Metadata (auth token, content type, etc.)
- **Body** — Data (POST/PUT mein)

### HTTP Response Structure
```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 82
Set-Cookie: sessionId=abc; HttpOnly
Cache-Control: no-cache

{"success": true, "data": {"id": 1, "name": "Rahul"}}
```

**Parts:**
- **Status Line** — HTTP version + status code + reason
- **Headers** — Metadata about response
- **Body** — Actual data

### HTTP Methods in Detail
| Method | Purpose | Has Body? | Idempotent? |
|--------|---------|-----------|-------------|
| GET | Data read karo | No | Yes |
| POST | Naya resource create karo | Yes | No |
| PUT | Poora resource replace karo | Yes | Yes |
| PATCH | Partial update karo | Yes | No |
| DELETE | Resource delete karo | No | Yes |
| HEAD | GET jaisa but sirf headers | No | Yes |
| OPTIONS | Kaunse methods allowed hain? | No | Yes |

**Idempotent** = Same request baar baar bhejo → same result.

### HTTP Status Codes (Complete List)

**2xx — Success**
```
200 OK                  → Request successful
201 Created             → Resource bana diya
202 Accepted            → Request received, processing later
204 No Content          → Success but no response body (DELETE)
```

**3xx — Redirection**
```
301 Moved Permanently   → URL permanently change ho gayi
302 Found               → Temporary redirect
304 Not Modified        → Cache use karo, data same hai
```

**4xx — Client Errors**
```
400 Bad Request         → Galat data bheja
401 Unauthorized        → Login nahi hai
403 Forbidden           → Login hai, permission nahi
404 Not Found           → Resource exist nahi karta
405 Method Not Allowed  → Ye method allowed nahi
409 Conflict            → Duplicate (email already exists)
410 Gone                → Resource permanently delete ho gaya
422 Unprocessable       → Validation failed
429 Too Many Requests   → Rate limit hit
```

**5xx — Server Errors**
```
500 Internal Server Error → Server pe kuch toot gaya
502 Bad Gateway           → Upstream server ne galat response diya
503 Service Unavailable   → Server down / overloaded
504 Gateway Timeout       → Upstream server ne respond nahi kiya
```

---

## 4. HTTPS — Secure HTTP

**HTTP mein problem:** Data plain text mein jaata hai — koi bhi beech mein padh sakta hai (Man-in-the-Middle attack).

**HTTPS = HTTP + TLS (Transport Layer Security)**

### TLS Handshake (Simplified)
```
Client → Server: "Baat karna chahta hoon. Supported encryption: [list]"
Server → Client: "SSL Certificate + Public Key"
Client: Certificate valid hai? (CA se verify)
Client → Server: "Pre-master secret" (encrypted with server's public key)
Both: Session key generate karo (symmetric)
Both: Ab sab communication is session key se encrypt hoga
```

### SSL Certificate
```
Kya contain karta hai:
- Domain name (google.com ke liye issue hua)
- Public key
- Issuing CA (Certificate Authority — like DigiCert, Let's Encrypt)
- Validity dates
- Digital signature

Browser kaise verify karta hai:
1. CA ka name dekho
2. Browser ke trusted CA list mein hai?
3. Signature verify karo
4. Expiry check karo
5. Domain name match karo
```

**Free SSL:** Let's Encrypt — production apps ke liye use karo.

---

## 5. TCP/IP — The Foundation

### TCP (Transmission Control Protocol)
**Reliable, ordered delivery.**

```
3-Way Handshake (connection establish karna):
Client → Server: SYN     ("Baat karna chahta hoon")
Server → Client: SYN-ACK ("Theek hai, main ready hoon")
Client → Server: ACK     ("Connected!")

Now data transfer happens.

4-Way Termination (connection close karna):
Client → Server: FIN
Server → Client: ACK
Server → Client: FIN
Client → Server: ACK
```

**TCP guarantees:**
- Data pahuncha → Acknowledgment
- Order preserve hoti hai
- Lost packets re-send hote hain
- Duplicate packets discard hote hain

### UDP (User Datagram Protocol)
**Fast, unreliable — "fire and forget"**

```
No handshake.
No acknowledgment.
No ordering.
No re-send on loss.

BUT: Bahut fast.
```

Use cases: Video streaming, online gaming, DNS queries, VoIP.

### IP (Internet Protocol)
**Routing — packet kaise source se destination tak pahunche.**

```
Data → Small packets mein toota jaata hai
Har packet → Independently route hota hai
Destination pe → Reassemble hota hai

Routing:
Packet mein destination IP hota hai.
Har router decide karta hai: "Is packet ko aage kahan bhejun?"
Hop by hop — destination tak pahunche.
```

---

## 6. Ports

Ek IP address ke paas **65535 ports** hote hain.

Ek service ek specific port pe sunti hai.

### Well-Known Ports
| Port | Service |
|------|---------|
| 20, 21 | FTP |
| 22 | SSH |
| 25 | SMTP (email send) |
| 53 | DNS |
| 80 | HTTP |
| 110 | POP3 (email receive) |
| 143 | IMAP (email) |
| 443 | HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 27017 | MongoDB |
| 3000 | Node.js dev server (convention) |

---

## 7. Complete Web Request Flow

**"User ne browser mein `https://api.example.com/users` type kiya"**

```
Step 1: URL Parse
  → Protocol: HTTPS
  → Domain: api.example.com
  → Path: /users

Step 2: DNS Lookup
  → Browser cache → OS cache → Recursive resolver → ... → IP mila
  → api.example.com = 104.21.xx.xx

Step 3: TCP Connection
  → 3-way handshake port 443 pe
  → Connection established

Step 4: TLS Handshake
  → Certificate exchange
  → Session key established
  → Encrypted channel ready

Step 5: HTTP Request Send
  → GET /users HTTP/2
  → Headers: Host, Accept, Authorization, etc.

Step 6: Server Processing
  → Request backend code tak pahunchi
  → Authentication check
  → Database query
  → Response prepare

Step 7: HTTP Response
  → 200 OK
  → Headers + JSON body

Step 8: TLS Decrypt
  → Response decrypt hota hai

Step 9: Browser Processing
  → JSON parse hota hai
  → Application code response handle karta hai

Step 10: Render / Process
  → Data display hota hai user ko
```

Total time: Typically 50–500ms depending on server location + network.

---

## 8. HTTP/1.1 vs HTTP/2 vs HTTP/3

| Feature | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---------|----------|--------|--------|
| Multiplexing | No (one req at a time per connection) | Yes | Yes |
| Header compression | No | Yes (HPACK) | Yes (QPACK) |
| Server push | No | Yes | Yes |
| Transport | TCP | TCP | QUIC (UDP-based) |
| Speed | Baseline | Faster | Fastest |

**HTTP/2 default hai most modern sites pe.**

---

## 9. WebSockets

Normal HTTP: Request → Response → Connection close.
WebSockets: Connection open rehti hai — **real-time bidirectional communication.**

```
Use cases:
- Chat applications
- Live notifications
- Real-time dashboards
- Online gaming
- Collaborative tools (like Google Docs)
```

```
HTTP Upgrade:
Client → Server: "HTTP se WebSocket pe upgrade karna chahta hoon"
Server → Client: "101 Switching Protocols"
Now: Both can send messages anytime without new request
```

---

## 10. CDN — Content Delivery Network

**Problem:** Server India mein hai, user USA mein — slow.

**CDN Solution:** Content multiple locations pe cache karo — user ko nearest server se serve karo.

```
Without CDN:
User (New York) → Server (Mumbai) → 200ms latency

With CDN:
User (New York) → CDN Edge (New York) → 10ms latency
(CDN ne Mumbai se already fetch karke cache kar rakha hai)
```

**Popular CDNs:** Cloudflare, AWS CloudFront, Akamai, Fastly

**What CDN caches:** Images, CSS, JS files, videos, static HTML — anything that doesn't change per user.

---

## Interview Questions — Step 01

**Q: HTTP aur HTTPS mein kya fark hai?**
> HTTP data plain text mein bhejta hai — insecure. HTTPS TLS encryption use karta hai — data encrypted hota hai in transit. Production mein hamesha HTTPS use karo.

**Q: DNS kya karta hai?**
> DNS domain names ko IP addresses mein translate karta hai — jaise phone book. Jab browser google.com type karta hai, DNS se IP milta hai, phir us IP pe request jaati hai.

**Q: TCP aur UDP mein kya fark hai?**
> TCP reliable, ordered delivery ensure karta hai — connection-based, acknowledgments hote hain. UDP fast but unreliable hai — no guarantees, no handshake. TCP use karo data integrity ke liye (HTTP, files), UDP use karo speed ke liye jahan kuch loss acceptable ho (video, gaming).

**Q: Status code 401 aur 403 mein kya fark hai?**
> 401 Unauthorized — user ne authenticate nahi kiya (login nahi). 403 Forbidden — user authenticated hai but ye resource access karne ki permission nahi.

**Q: GET aur POST mein kya fark hai?**
> GET data fetch karta hai, body nahi hoti, URL mein params hote hain, cacheable hai. POST naya resource create karta hai, body hoti hai, cacheable nahi.

---

## Assignment — Step 01

1. Browser developer tools kholо (F12) → Network tab → `jsonplaceholder.typicode.com/users` visit karo → ek request click karo → Headers, status code, response body dekho

2. Apne terminal mein:
   ```bash
   curl -v https://jsonplaceholder.typicode.com/users/1
   ```
   Output mein TCP handshake, TLS, request headers, response headers identify karo.

3. Likho (apni bhasha mein): "User ne amazon.in type kiya — step by step kya hua?"
