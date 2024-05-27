""" Script for generating prime prompt """

import os
from os.path import normpath, join

project_folder = normpath(join(__file__, '..', '..'))


def scan_docs(path: str):
    """
    Scans Python file and yields function and its documentation
    :param path: path of file
    """
    with open(path, "r", encoding="utf=8") as python_file:
        lines = python_file.readlines()
        i = 0
        while i < len(lines):
            line = lines[i]
            i += 1
            if not line.startswith("def ") or line[4] == "_":
                continue

            function_name = line[4:line.index("(")]
            i += 1  # skip first """

            function_documentation = ""
            while True:
                if lines[i].strip() == "\"\"\"":
                    break
                function_documentation += lines[i]
                i += 1
            yield function_name, function_documentation


llm_related_modules = ["data_collection"]
with open("prime_prompt.txt", "w", encoding="utf=8") as f:
    for module in llm_related_modules:
        for directory, folder, files in os.walk(join(project_folder, module)):
            for file in files:
                for function, documentation in scan_docs(join(directory, file)):
                    f.write(f"Documentation for {function}\n")
                    f.write(documentation + "\n\n")
