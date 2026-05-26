# PrivaText

**A serverless encrypted group chat application demonstrating privacy-conscious design patterns and decentralized communication concepts.**

## Overview

PrivaText is a portfolio project showcasing encrypted, password-protected group chat functionality built on serverless infrastructure. 
It is fully functional, stable, usable, and has custom styles.

## Features

- 🔐 **End-to-End Encryption**: Group chats with client-side encryption
- 🔒 **Password Protection**: Access control for chat groups
- 📱 **Serverless Architecture**: Stateless, scalable deployment model
- 💬 **Real-time Messaging**: Live group communication
- 🎬 **Limited Media Support**: Image/video sharing capabilities (45kb limit)
- 💻 **Portfolio Showcase**: Clean implementation of cryptographic patterns and web architecture

## Technology Stack

- **Frontend**: HTML/JavaScript
- **Encryption**: Client-side cryptographic operations
- **Infrastructure**: Serverless functions and backend services
- **Protocol Concepts**: Nostr-inspired message architecture

## Privacy & Security Considerations

### What This Project Demonstrates

✅ Client-side encryption implementation  
✅ Password-based key derivation patterns  
✅ Stateless serverless architecture design  
✅ Decentralized messaging concepts  
✅ Event-based communication models

### Important Limitations ⚠️

This is a **portfolio project** and should **not be used for sensitive communications**. Be aware of these limitations:

#### Cryptographic Considerations
- **No formal security audit**: This code has not been audited by security professionals
- **Educational implementation**: Cryptographic implementations are for demonstration purposes
- **Key derivation**: Password-based key derivation is limited due to serverless-infrastructure

#### Serverless Infrastructure Limitations
- **Metadata exposure**: Serverless platforms log timestamps, IP addresses, and request patterns
- **Provider visibility**: Your cloud provider has access to metadata (though not encrypted content)
- **Statelessness trade-offs**: Reliance on external storage for persistence

#### Nostr/Decentralized Protocol Limitations
- **Decentralized doesn't mean private**: Nostr relays store events with timestamps and metadata
- **No relay anonymity**: Relay operators can see connection patterns
- **Pseudonymity, not anonymity**: Public keys can be linked to user behavior
- **Content replication**: Messages stored on multiple relays increase exposure surface
- **Metadata visibility**: Timestamps and relay selections reveal communication patterns

#### Additional Constraints
- **Limited media handling**: Not optimized for sensitive media encryption workflows
- **Single password model**: Group-wide password sharing model doesn't provide individual accountability
- **No message deletion guarantee**: Serverless architecture may retain encrypted copies

### Recommended Use Cases
✅ Low-sensitivity group coordination   
✅ Host private GCs with friends
✅ Check out a cool texting site and support the creator's rep

### Not Recommended For

❌ Sensitive business communications  
❌ Legally privileged information  
❌ Financial data or credentials  
❌ Healthcare or PII  
❌ Production security-critical applications  
❌ Whistleblowing or dissent in hostile environments


