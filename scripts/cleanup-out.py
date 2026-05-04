"""
Next.js 16 が生成する __next.* RSC ペイロードファイルを削除する。
Cloudflare Pages の 20,000 ファイル制限に対応するため。
"""
import os, shutil, sys

out_dir = os.path.join(os.path.dirname(__file__), "..", "out")
out_dir = os.path.abspath(out_dir)

if not os.path.isdir(out_dir):
    print("out/ ディレクトリが存在しません。スキップします。")
    sys.exit(0)

print("cleanup: removing __next.* and index.txt files...")

removed = 0
for root, dirs, files in os.walk(out_dir, topdown=True):
    # __next.* ディレクトリを削除（os.walk から除外して中に入らない）
    to_remove = [d for d in dirs if d.startswith("__next.")]
    for d in to_remove:
        shutil.rmtree(os.path.join(root, d), ignore_errors=True)
        dirs.remove(d)
        removed += 1

    # __next.* ファイルと index.txt を削除
    for f in files:
        if f.startswith("__next.") or f == "index.txt":
            os.remove(os.path.join(root, f))
            removed += 1

# 残りのファイル数をカウント
count = sum(len(files) for _, _, files in os.walk(out_dir))
print(f"done: removed {removed} entries. remaining files: {count} / 20000")

if count > 20000:
    print(f"ERROR: still {count} files, exceeds limit!")
    sys.exit(1)
