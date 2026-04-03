## Error Type
Console Error

## Error Message
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <SortableContext items={[...]} strategy={function verticalListSortingStrategy}>
      <div className="space-y-2">
        <AnimatePresence initial={true}>
          <PresenceChild isPresent={true} initial={undefined} custom={undefined} presenceAffectsLayout={true} mode="sync" ...>
            <PopChild pop={false} isPresent={true} anchorX="left" anchorY="top" root={undefined}>
              <PopChildMeasure isPresent={true} childRef={{current:null}} sizeRef={{...}} pop={false}>
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20, ...}} ...>
                  <MeasureLayout>
                  <div style={{opacity:0, ...}} ref={function useMotionRef.useCallback}>
                    <QuestionItem question={{id:"6224c4...", ...}} onEdit={function onEdit} onDelete={function onDelete} ...>
                      <div ref={function useCombinedRefs.useMemo} style={{...}} className="flex items...">
                        <button
                          className="touch-none cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:tex..."
                          role="button"
                          tabIndex={0}
                          aria-disabled={false}
                          aria-pressed={undefined}
                          aria-roledescription="sortable"
+                         aria-describedby="DndDescribedBy-0"
-                         aria-describedby="DndDescribedBy-2"
                          onPointerDown={function useSyntheticListeners.useMemo}
                          onKeyDown={function useSyntheticListeners.useMemo}
                        >
                        ...
                      ...
          <PresenceChild isPresent={true} initial={undefined} custom={undefined} presenceAffectsLayout={true} mode="sync" ...>
            <PopChild pop={false} isPresent={true} anchorX="left" anchorY="top" root={undefined}>
              <PopChildMeasure isPresent={true} childRef={{current:null}} sizeRef={{...}} pop={false}>
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20, ...}} ...>
                  <MeasureLayout>
                  <div style={{opacity:0, ...}} ref={function useMotionRef.useCallback}>
                    <QuestionItem question={{id:"97caf2...", ...}} onEdit={function onEdit} onDelete={function onDelete} ...>
                      <div ref={function useCombinedRefs.useMemo} style={{...}} className="flex items...">
                        <button
                          className="touch-none cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:tex..."
                          role="button"
                          tabIndex={0}
                          aria-disabled={false}
                          aria-pressed={undefined}
                          aria-roledescription="sortable"
+                         aria-describedby="DndDescribedBy-0"
-                         aria-describedby="DndDescribedBy-2"
                          onPointerDown={function useSyntheticListeners.useMemo}
                          onKeyDown={function useSyntheticListeners.useMemo}
                        >
                        ...
                      ...



    at createConsoleError (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_5d0a5725._.js:2199:71)
    at handleConsoleError (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_5d0a5725._.js:2980:54)
    at console.error (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_5d0a5725._.js:3124:57)
    at <unknown> (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:3469:25)
    at runWithFiberInDEV (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:965:74)
    at emitPendingHydrationWarnings (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:3468:13)
    at completeWork (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:7076:32)
    at runWithFiberInDEV (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:965:74)
    at completeUnitOfWork (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:9627:23)
    at performUnitOfWork (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:9564:28)
    at workLoopConcurrentByScheduler (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:9558:58)
    at renderRootConcurrent (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:9541:71)
    at performWorkOnRoot (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:9068:150)
    at performWorkOnRootViaSchedulerTask (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:10230:9)
    at MessagePort.performWorkUntilDeadline (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_3cedf71e._.js:2647:64)
    at button (<anonymous>:null:null)
    at QuestionItem (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/5stelle_src_2eb2c1f0._.js:745:234)
    at <unknown> (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/5stelle_src_2eb2c1f0._.js:1115:252)
    at Array.map (<anonymous>:null:null)
    at QuestionList (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/5stelle_src_2eb2c1f0._.js:1093:41)
    at FormBuilderClient (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/5stelle_src_2eb2c1f0._.js:2756:248)
    at FormBuilderPage (about://React/Server/file:///Users/filippoaggio/Filippo/Web%20Dev/5stelle/.next/dev/server/chunks/ssr/%5Broot-of-the-server%5D__7adbc8cf._.js?134:237:275)

Next.js version: 16.1.6 (Turbopack)
