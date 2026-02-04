function printSequencesIterativeOptimized(n) {
    if (!Number.isInteger(n) || n < 0) return;
  
    const path = [];
    // Frame: { remaining, stage }
    // stage 0 => try '1', stage 1 => try '2', stage 2 => backtrack
    const stack = [{ remaining: n, stage: 0 }];
  
    while (stack.length) {
      const top = stack[stack.length - 1];
  
      if (top.remaining === 0) {
        console.log(path.join(""));
        // backtrack from solution
        stack.pop();
        if (path.length) path.pop();
        continue;
      }
  
      if (top.remaining < 0) {
        // dead end, backtrack
        stack.pop();
        if (path.length) path.pop();
        continue;
      }
  
      if (top.stage === 0) {
        top.stage = 1;
        path.push(1);
        stack.push({ remaining: top.remaining - 1, stage: 0 });
      } else if (top.stage === 1) {
        top.stage = 2;
        path.push(2);
        stack.push({ remaining: top.remaining - 2, stage: 0 });
      } else {
        // finished both branches
        stack.pop();
        if (path.length) path.pop();
      }
    }
  }