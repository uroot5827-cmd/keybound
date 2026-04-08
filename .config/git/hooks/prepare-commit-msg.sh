#!/bin/bash
# Git prepare-commit-msg hook
# 自动追加 Issue 编号（如果当前分支名包含 issue 编号）

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

# 如果是 merge 或 squash 提交，不修改
if [ -n "$COMMIT_SOURCE" ]; then
    exit 0
fi

# 获取当前分支名
BRANCH_NAME=$(git symbolic-ref --short HEAD 2>/dev/null)

# 从分支名提取 Issue 编号（格式：123-xxx 或 feat/123-xxx 或 #123）
ISSUE_NUM=$(echo "$BRANCH_NAME" | grep -oE '([0-9]+)-' | head -1 | tr -d '-')
if [ -n "$ISSUE_NUM" ]; then
    # 检查文件是否已有 issue 引用
    if ! grep -qE '(#[0-9]+|Closes|Fixes|Ref)' "$COMMIT_MSG_FILE"; then
        echo "" >> "$COMMIT_MSG_FILE"
        echo "Closes #$ISSUE_NUM" >> "$COMMIT_MSG_FILE"
    fi
fi
