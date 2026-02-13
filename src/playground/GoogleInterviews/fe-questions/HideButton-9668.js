// 1) The question (what they’re asking)

// You have a homepage with a “Search Now” button. Search is temporarily disabled for this website, so you need to hide that button.

// They want you to brainstorm multiple ways to hide an element using:
// 	•	CSS
// 	•	HTML
// 	•	JavaScript
// …and show that you understand tradeoffs + accessibility.

// ⸻

// 2) Constraints / expectations (what interviewers are checking)

// Even though it’s “simple”, they’re checking:

// Functional constraints
// 	•	Button should not be visible.
// 	•	Ideally it should not be focusable / clickable.
// 	•	In some approaches it should not take layout space (depends on method).

// Accessibility constraints (big for L4/L5)
// 	•	Should not remain in the tab order if “hidden”.
// 	•	Should not be announced by screen readers if it’s not meant to exist for users.
// 	•	If it’s “temporarily unavailable”, sometimes it’s better UX to disable + explain instead of hiding.

// ⸻

// 3) Follow-up questions (common ones)

// Follow-up #1: display: none vs visibility: hidden vs opacity: 0

// Key differences:
// 	•	display: none: removed from layout, not visible, not focusable, not in accessibility tree. (removed in the accessibility tree, so no announcement as well)
// 	•	visibility: hidden: invisible but keeps space; not focusable. (removed in the accessibility tree, so no announcement as well)
// 	•	opacity: 0: invisible but still takes space and is often still focusable/clickable unless you also disable pointer/focus. (not removed in the accessibility tree as well, so will be announced)

// Interviewers love asking: “Which would you choose and why?”

// ⸻

// Follow-up #2: Hide with CSS vs remove from DOM
// 	•	CSS hide: easier to toggle back on, keeps DOM/state, can animate.
// 	•	Remove from DOM: cleanest, no accidental focus/click, fewer surprises.

// ⸻

// Follow-up #3: If you must keep it for layout but hide visually

// They expect you to mention “visually hidden” patterns (usually for accessibility labels) — but for a real button you usually should not do that.

// ⸻

// 4) JavaScript solutions (good answers)

// A) Remove the element from the DOM (clean + safe)
// const btn = document.querySelector('#searchNow');
// btn?.remove();

// Pros
// 	•	Gone for everyone (including screen readers)
// 	•	Not focusable, not clickable
// 	•	No layout space

// Cons
// 	•	If you need it later, you must re-create it (or render it conditionally via framework)

// B) Hide via CSS using JS (toggle-able)
// const btn = document.querySelector('#searchNow');
// if (btn) btn.style.display = 'none';

// Pros
// 	•	Easy to bring back (display = '')
// 	•	Doesn’t require rebuilding

// Cons
// 	•	Inline style overrides CSS (sometimes messy)

// C) “Best practice” toggle with a CSS class

// HTML: <button id="searchNow">Search Now</button>
// CSS: .is-hidden { display: none; }
// JS:  const btn = document.querySelector('#searchNow');
//      btn?.classList.add('is-hidden');

// Pros
// 	•	Clean separation of concerns
// 	•	Easy to maintain, easy to toggle

// 5) Accessibility-aware JS solution (recommended)

// If search is disabled temporarily, one very good UX approach is: disable the button + explain why, instead of fully hiding it.
// const btn = document.querySelector('#searchNow');

// if (btn) {
//   btn.disabled = true;
//   btn.setAttribute('aria-disabled', 'true');
//   btn.setAttribute('title', 'Search is temporarily unavailable');
//   // Optional: show a small text near it in UI explaining the reason
// }

// If you truly must hide it:
// const btn = document.querySelector('#searchNow');

// if (btn) {
//   btn.classList.add('is-hidden');  // display:none
//   // display:none already removes it from accessibility tree
// }

// 6) What a “strong” final answer sounds like (in an interview)
// 	•	“I can hide it with display:none, visibility:hidden, remove it from DOM, or conditionally render it.”
// 	•	“If I use opacity:0, I must also handle pointer events and focus because it can still be tabbable.”
// 	•	“For accessibility, a hidden element shouldn’t be reachable by keyboard or screen readers.”
// 	•	“Product-wise, if search is temporarily disabled, disabling with an explanation may be better than hiding.”