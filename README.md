# PrivaText

**A serverless encrypted group chat application demonstrating privacy-conscious design patterns and decentralized communication concepts.**

## Overview

PrivaText is a portfolio project showcasing encrypted, password-protected group chat functionality built on serverless infrastructure. The application demonstrates key concepts in client-side encryption, cryptographic protocols, and serverless architecture patterns while maintaining transparency about its limitations.

## Features

- 🔐 **End-to-End Encryption**: Group chats with client-side encryption
- 🔒 **Password Protection**: Access control for chat groups
- 📱 **Serverless Architecture**: Stateless, scalable deployment model
- 💬 **Real-time Messaging**: Live group communication
- 🎬 **Limited Media Support**: Image/video sharing capabilities
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

This is a **portfolio/educational project** and should **not be used for sensitive communications**. Be aware of these limitations:

#### Cryptographic Considerations
- **No formal security audit**: This code has not been audited by security professionals
- **Educational implementation**: Cryptographic implementations are for demonstration purposes
- **Browser crypto dependencies**: Security relies on browser WebCrypto API implementations
- **Key derivation**: Password-based key derivation may not meet production-grade entropy requirements

#### Serverless Infrastructure Limitations
- **Metadata exposure**: Serverless platforms log timestamps, IP addresses, and request patterns
- **Provider visibility**: Your cloud provider has access to metadata (though not encrypted content)
- **No perfect forward secrecy**: Historical messages cannot be guaranteed as deleted
- **Statelessness trade-offs**: Reliance on external storage for persistence
- **Rate limiting**: May expose usage patterns

#### Nostr/Decentralized Protocol Limitations
- **Decentralized doesn't mean private**: Nostr relays store events with timestamps and metadata
- **No relay anonymity**: Relay operators can see connection patterns
- **Pseudonymity, not anonymity**: Public keys can be linked to user behavior
- **Content replication**: Messages stored on multiple relays increase exposure surface
- **Metadata visibility**: Timestamps and relay selections reveal communication patterns

#### Additional Constraints
- **Limited media handling**: Not optimized for sensitive media encryption workflows
- **Single password model**: Group-wide password sharing model doesn't provide individual accountability
- **Session management**: Browser-based sessions vulnerable to XSS and similar attacks
- **No message deletion guarantee**: Serverless architecture may retain encrypted copies

### Recommended Use Cases

✅ Educational learning about cryptography  
✅ Portfolio demonstration of web architecture  
✅ Low-sensitivity group coordination  
✅ Understanding decentralized protocols  
✅ Exploring serverless design patterns

### Not Recommended For

❌ Sensitive business communications  
❌ Legally privileged information  
❌ Financial data or credentials  
❌ Healthcare or PII  
❌ Production security-critical applications  
❌ Whistleblowing or dissent in hostile environments

## Architecture
