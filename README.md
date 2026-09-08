# 🫙 Random Task Jar

A minimal personal productivity app. Add tasks to a jar, shake it, and let fate decide what you do next.

---

## Features

- Add tasks with optional date and time
- Edit or delete any task inline
- Shake the jar to pick a random task
- Toggle: automatically remove a task from the jar after it's picked
- All data persisted in localStorage — no backend, no login, no cloud
- Animated 3D particle background via Three.js
- Flying animation when adding a task (📝 flies from the form into the jar)

---

## Tech stack

| Layer      | Choice                     |
|------------|----------------------------|
| Build tool | Vite                       |
| UI         | React + JSX                |
| Styling    | Tailwind CSS v4            |
| 3D / FX    | Three.js                   |
| Storage    | localStorage               |
| Backend    | None                       |

---

## Getting started

```bash
cd random-task
npm install
npm run dev
```

Open http://localhost:5173

### Build for production

```bash
npm run build
npm run preview
```

---

## Project structure

```
src/
├── components/
│   ├── Background.jsx    # Three.js canvas — floating orbs + particles
│   ├── RandomResult.jsx  # Overlay showing the picked task
│   ├── TaskForm.jsx      # Add-task form + fly-to-jar animation
│   ├── TaskItem.jsx      # Single task row — inline edit + delete
│   └── TaskList.jsx      # Task list with empty state
│
├── hooks/
│   └── useTasks.js       # add / edit / delete / randomTask + localStorage sync
│
├── utils/
│   └── storage.js        # loadTasks / saveTasks (localStorage wrapper)
│
├── App.jsx               # Root — layout, jar ref, random + toggle state
├── main.jsx              # Entry point
└── index.css             # Theme tokens, keyframes, utility classes
```

---

## Changing the color theme

All brand colors live as CSS custom properties at the top of `src/index.css`:

```css
:root {
  --c-accent:      #3b82f6;   /* primary color (buttons, focus rings) */
  --c-accent-lt:   #60a5fa;   /* lighter variant                      */
  --c-accent-dk:   #1d4ed8;   /* darker variant (gradient start)      */
  --c-accent-glow: rgba(59, 130, 246, 0.40);

  --c-bg:          #05080f;   /* page background                      */
  --c-text:        #e8f0fe;   /* default text                         */

  --c-grad-start:  #bfdbfe;   /* title gradient — light end           */
  --c-grad-mid:    #60a5fa;   /* title gradient — mid                 */
  --c-grad-end:    #2563eb;   /* title gradient — dark end            */
  /* ... */
}
```

To switch to a different palette (e.g. purple), just replace the hex values in `:root` — no component files need to change.

The Three.js orb colors are in `src/components/Background.jsx` as the `ORB_COLORS` array at the top of the file.

---

## Data model

```js
// localStorage key: "random-task-jar"
{
  id:          string,   // crypto.randomUUID()
  description: string,   // required
  date:        string | null,  // "YYYY-MM-DD", optional
  time:        string | null,  // "HH:MM", optional
  createdAt:   string,   // ISO 8601
}
```

---

## localStorage behavior

| Event          | Action                              |
|----------------|-------------------------------------|
| Add task       | Append to array, write to storage   |
| Edit task      | Update in array, write to storage   |
| Delete task    | Remove from array, write to storage |
| Page reload    | Read from storage on mount          |
| "Remove after" toggle | Saved to `random-task-jar-remove-after` |

Data never leaves the browser.
