import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';

type Note = {
  id: string;
  notebookId: string;
  title: string;
  content: string;
};

@Injectable()
export class RagService {
  // 🔹 In-memory mock notes (pretend these came from a DB)
  private notes: Note[] = [
    {
      id: 'note-1',
      notebookId: 'notebook-llm',
      title: 'Project Overview',
      content:
        'NotebookLM Lite is a note-first app where users create notebooks and ask questions about them using an AI assistant.',
    },
    {
      id: 'note-2',
      notebookId: 'notebook-llm',
      title: 'Tech Stack',
      content:
        'The backend is built with NestJS. It uses a modular architecture with an LLM module and a RAG module.',
    },
    {
      id: 'note-3',
      notebookId: 'notebook-llm',
      title: 'Future Ideas',
      content:
        'In the future we want to support user uploads, multi-notebook context, and source citations like NotebookLM.',
    },
    {
      id: 'note-4',
      notebookId: 'personal-fitness',
      title: 'Workout Plan',
      content:
        'My workout plan focuses on calisthenics: planche, front lever, one arm chin ups, pistol squats, and ring work.',
    },
  ];

  constructor(private readonly llmService: LlmService) {}

  async askAboutNotebook(question: string, notebookId: string) {
    const candidateNotes = this.notes.filter(
      (n) => n.notebookId === notebookId,
    );

    // No notes for this notebook
    if (candidateNotes.length === 0) {
      const reply = await this.llmService.chat({
        userMessage: question,
        systemPrompt:
          'You are an assistant for a notebook app. There are no notes available for this notebook, so explain that you cannot answer based on notes.',
      });

      return {
        reply,
        sources: [],
      };
    }

    // 🔎 Super simple "retrieval": keyword score based on question words
    const words = question
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2); // ignore super-short words

    const scored = candidateNotes
      .map((note) => {
        const haystack =
          (note.title + ' ' + note.content).toLowerCase();
        let score = 0;
        for (const w of words) {
          if (haystack.includes(w)) score++;
        }
        return { note, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    const top = (scored.length > 0 ? scored : candidateNotes.map((n) => ({ note: n, score: 0 }))).slice(
      0,
      3,
    );

    const context = top
      .map(
        (entry, idx) =>
          `Note ${idx + 1} (id=${entry.note.id}, title="${
            entry.note.title
          }"):\n${entry.note.content}`,
      )
      .join('\n\n');

    const systemPrompt = [
      'You are an AI assistant for a notebook app.',
      'Use ONLY the following note context to answer the user question.',
      'If the answer is not in the notes, say you do not know based on these notes.',
      '',
      '--- NOTE CONTEXT ---',
      context || '(no notes found)',
      '--------------------',
    ].join('\n');

    const reply = await this.llmService.chat({
      userMessage: question,
      systemPrompt,
    });

    return {
      reply,
      sources: top.map((entry) => ({
        id: entry.note.id,
        title: entry.note.title,
        preview: entry.note.content.slice(0, 120),
        score: entry.score,
      })),
    };
  }
}
