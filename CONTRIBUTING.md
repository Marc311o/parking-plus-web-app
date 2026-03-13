# Contributing to Parking+ 🚀

Thank you for your interest in contributing to our project! To maintain high code quality and a clean commit history, we follow a strict workflow based on the **Gitflow** model.

---

## 🏗 Workflow (Gitflow)

Our development process relies on two main branches:
* `main` – Contains only stable, production-ready code. Every commit here is tagged with a version number.
* `develop` – The main integration branch. All new features and improvements are merged here first.

### How to start a task?
1. Pick an issue from the current **Milestone**.
2. Create a new branch from `develop` following our naming convention.
3. Once your work is complete, open a **Pull Request** to the `develop` branch.

---

## 🏷 Branch Naming Convention

This repository has **Repository Rulesets** enabled. Branches that do not follow the patterns below will be rejected by the system:

| Type | Prefix | Description | Example |
| :--- | :--- | :--- | :--- |
| **Feature** | `feature/` | New functionality | `feature/123-login-form` |
| **Bugfix** | `bugfix/` | Standard bug fixes for develop | `bugfix/45-header-glitch` |
| **Hotfix** | `hotfix/` | Critical production fixes | `hotfix/critical-security-patch` |
| **Release** | `release/` | Preparing a new version | `release/v1.2.0` |
| **Documentation** | `docs/` | For filling up the documentation | `docs/xyz-module-documentation` |
| **Chore** | `chore/` | Tasks related to project (like setup) | `chore/pr-templates` |

*Guidelines: Use lowercase letters, numbers, and hyphens ([kebab-case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case)). Avoid special characters.*

---

## 📋 Pull Requests

Every PR must be verified before merging. To be accepted, it must meet the following criteria:
1. **Description:** Clearly explain what was changed and why.
2. **Linkage:** Reference the related issue (e.g., `Closes #45`).
3. **Review:** At least one approval from a maintainer is required.

---

## ⚖️ License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. By contributing, you agree that your contributions will be licensed under the same terms.