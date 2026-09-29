# VidyaSetu MP — Academic Doubt Resolution Router (Hybrid RAG)
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.doubt import (
    DoubtResolveRequest,
    DoubtResponse,
    MentorResolveRequest,
)
from backend.services.rag_service import HybridRAGService
from backend.models.doubt import DoubtTicket

router = APIRouter(prefix="/api/v1/doubts", tags=["Academic Doubt Resolution (Hybrid RAG)"])

@router.post("/resolve", response_model=DoubtResponse)
def resolve_academic_doubt(request: DoubtResolveRequest, db: Session = Depends(get_db)):
    """
    Asynchronously or synchronously resolves an academic curriculum question via Hybrid RAG.
    Enforces Mathematical Confidence Locking (< 0.72):
    - Score >= 0.72: Grounded answer with exact textbook & page citation.
    - Score < 0.72: Locks generative answer, displays closest reference, and escalates to Faculty Mentor.
    """
    response = HybridRAGService.resolve_doubt(request)

    # Persist in DB if session is active
    try:
        ticket = DoubtTicket(
            client_mutation_id=request.client_mutation_id or response.ticket_id,
            query_text_raw=request.query_text,
            normalized_query=response.query_normalized,
            detected_dialect=response.detected_dialect,
            retrieval_confidence_score=response.confidence_score,
            ai_generated_answer=response.answer_text,
            citation_source=response.citation_source,
            status=response.status
        )
        db.add(ticket)
        db.commit()
    except Exception:
        db.rollback()

    return response

@router.get("/tickets")
def list_doubt_tickets(
    status: Optional[str] = Query(None, description="RESOLVED_AI | ESCALATED_FACULTY | CLOSED"),
    db: Session = Depends(get_db)
):
    """Lists doubt tickets for faculty escalation and review."""
    query = db.query(DoubtTicket)
    if status:
        query = query.filter(DoubtTicket.status == status)
    
    tickets = query.order_by(DoubtTicket.created_at.desc()).limit(50).all()
    return [
        {
            "id": t.id,
            "query_raw": t.query_text_raw,
            "query_normalized": t.normalized_query,
            "detected_dialect": t.detected_dialect,
            "confidence_score": t.retrieval_confidence_score,
            "status": t.status,
            "ai_generated_answer": t.ai_generated_answer,
            "citation_source": t.citation_source,
            "mentor_resolution_text": t.mentor_resolution_text,
            "created_at": t.created_at.isoformat() if t.created_at else None
        }
        for t in tickets
    ]

@router.post("/tickets/{ticket_id}/resolve-mentor")
def resolve_by_faculty_mentor(
    ticket_id: str,
    req: MentorResolveRequest,
    db: Session = Depends(get_db)
):
    """Faculty Mentor endpoint to resolve escalated doubts with text and voice notes."""
    ticket = db.query(DoubtTicket).filter(
        (DoubtTicket.id == ticket_id) | (DoubtTicket.client_mutation_id == ticket_id)
    ).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Doubt ticket not found")

    ticket.status = "CLOSED"
    ticket.assigned_mentor_id = req.mentor_id
    ticket.mentor_resolution_text = req.resolution_text
    ticket.mentor_voice_note_uri = req.voice_note_uri
    db.commit()

    return {
        "status": "SUCCESS",
        "ticket_id": ticket_id,
        "message": "Doubt resolved by faculty mentor successfully."
    }
