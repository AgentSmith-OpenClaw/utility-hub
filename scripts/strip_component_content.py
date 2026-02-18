#!/usr/bin/env python3
"""
Strip educational/FAQ content from AmortizationCalculator.
Lines 532-629 contain orphaned closing tags and educational content.
"""

import os

filepath = '/Users/sunny/Projects/utility-hub/src/components/AmortizationCalculator/AmortizationCalculator.tsx'
with open(filepath, 'r') as f:
    lines = f.readlines()

orig = len(lines)
print("Total lines:", orig)
print("Line 530:", repr(lines[529].rstrip()))
print("Line 532:", repr(lines[531].rstrip()))
print("Line 629:", repr(lines[628].rstrip()))
print("Line 631:", repr(lines[630].rstrip()))

# Delete lines 532-629 (0-indexed: 531 to 628)
start_del = 531   # line 532 (orphaned </div>)
end_del = 629     # line 629 </section> (last line of educational section)

new_lines = lines[:start_del] + lines[end_del:]
with open(filepath, 'w') as f:
    f.writelines(new_lines)

print("Removed", end_del - start_del, "lines =>", orig, "->", len(new_lines), "lines")


