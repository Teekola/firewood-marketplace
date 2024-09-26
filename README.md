# Firewood Marketplace App

## Development Workflow

### Tools:

-  **[Git](https://git-scm.com/)**: Version control system to track changes in code.
-  **[Husky](https://typicode.github.io/husky/#/)**: Git hooks for automating tasks, such as running linting before committing.
-  **[lint-staged](https://github.com/okonet/lint-staged)**: Runs linters on only staged files, improving commit efficiency.
-  **[ESLint](https://eslint.org/)**: A tool for identifying and fixing problems in JavaScript/TypeScript code.
-  **[Prettier](https://prettier.io/)**: Code formatter that enforces a consistent style across the codebase.

---

### Commit Flow:

2. **Commit staged files**  
   Commit your changes using the following format:

   ```bash
   git commit -m "<commit type>: <commit message>"
   ```

   -  **Commit types**: These indicate the nature of the change. Examples include:
      -  `feat`: New feature
      -  `fix`: Bug fix
      -  `refactor`: Code restructuring without changing behavior
      -  `test`: Adding or updating tests
      -  `docs`: Documentation changes
      -  `ci`: Continuous integration setup or changes
      -  `chore`: General maintenance tasks (e.g., dependency updates)

   Example commit message:

   ```bash
   git commit -m "feat: add user authentication flow"
   ```

3. **Pre-commit Hook**  
   The `.husky` folder contains a pre-commit hook that runs the following command before the commit is finalized:

   ```bash
   npx lint-staged
   ```

4. **Lint-staged**  
   `lint-staged` runs commands for the staged code defined in `lint-staged.config.mjs`:

   -  Linting with ESLint
   -  Formatting with Prettier

5. **Successful Commit**  
   When the `lint-staged` process succeeds, the code is committed to Git.
